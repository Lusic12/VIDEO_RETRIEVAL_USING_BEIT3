interface RadioOptionProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioOption: React.FC<RadioOptionProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
}) => (
  <div className="flex flex-row items-center gap-2">
    <input
      type="radio"
      name="scope"
      id={id}
      checked={checked}
      onChange={onChange}
    />
    <div className="flex flex-col">
      <label htmlFor={id}>{label}</label>
      <sub className="text-gray-500 text-xs">{description}</sub>
    </div>
  </div>
);
