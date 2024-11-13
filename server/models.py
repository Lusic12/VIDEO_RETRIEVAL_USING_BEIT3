import torch
from transformers import XLMRobertaTokenizer
from beit3.modeling_finetune import beit3_base_patch16_384_retrieval
from config import MODEL_PATH, MODEL_WEIGHT_PATH, MAX_LEN
import numpy as np

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


def get_sentencepiece_model_for_beit3(model_path):
    return XLMRobertaTokenizer(model_path)


tokenizer = get_sentencepiece_model_for_beit3(model_path=MODEL_PATH)

model = beit3_base_patch16_384_retrieval(pretrained=True)
checkpoint = torch.load(MODEL_WEIGHT_PATH, map_location=device)
model.load_state_dict(checkpoint['model'])
model.to(device)
model.eval()


def to_text_tokens(text, max_len=64):

    tokens_orig = tokenizer.tokenize(text)
    token_ids = tokenizer.convert_tokens_to_ids(tokens_orig)
    tokens = token_ids

    if len(tokens) > max_len - 2:
        tokens = tokens[:max_len - 2]

    tokens = [tokenizer.bos_token_id] + tokens[:] + [tokenizer.eos_token_id]
    num_tokens = len(tokens)
    padding_mask = [0] * num_tokens + [1] * (max_len - num_tokens)
    tokens_true = tokens + [tokenizer.pad_token_id] * (max_len - num_tokens)

    padding_mask_tensor = torch.tensor(padding_mask).reshape(1, -1).to(device)
    token_ids_tensor = torch.tensor(tokens_true).reshape(1, -1).to(device)

    return token_ids_tensor, padding_mask_tensor


def calc_text_embedding(text):
    tokens, attention_mask = to_text_tokens(text)
    outputs = model(text_description=tokens,
                        padding_mask=attention_mask, only_infer=True)
    return outputs[1]


def encode_text_query(text_query):
    text_embedding = calc_text_embedding(
        text_query).cpu().detach().numpy().flatten()
    text_embedding = text_embedding / np.linalg.norm(text_embedding)
    return text_embedding
