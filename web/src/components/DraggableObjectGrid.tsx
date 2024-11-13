import React, { useState, useRef, useCallback } from 'react';
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Line,
  Transformer,
} from 'react-konva';
import Konva from 'konva';
import { FaTrash, FaUndo } from 'react-icons/fa';
import { ObjectList } from '../constants/objects';
import useImage from 'use-image';

const GRID_SIZE = 8;
const CANVAS_WIDTH = 275;
const CANVAS_HEIGHT = 225;
const CELL_WIDTH = CANVAS_WIDTH / GRID_SIZE;
const CELL_HEIGHT = CANVAS_HEIGHT / GRID_SIZE;

type IconType = {
  id: string;
  src: string;
  alt: string;
};

type ImageObject = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  src: string;
};
const URLImage: React.FC<{
  image: ImageObject;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<ImageObject>) => void;
}> = ({ image, isSelected, onSelect, onChange }) => {
  const [img] = useImage(image.src);
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragStart = () => {
    if (shapeRef.current) {
      shapeRef.current.moveToTop();
      if (trRef.current) {
        trRef.current.moveToTop();
      }
    }
  };

  return (
    <>
      <KonvaImage
        image={img}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        rotation={image.rotation}
        offsetX={image.width / 2}
        offsetY={image.height / 2}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onDragStart={handleDragStart}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation(),
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          rotateEnabled={true}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ]}
        />
      )}
    </>
  );
};

const GridLayer: React.FC<{
  cellWidth: number;
  cellHeight: number;
  gridSize: number;
}> = ({ cellWidth, cellHeight, gridSize }) => {
  return (
    <Layer>
      {Array.from({ length: gridSize - 1 }, (_, i) => (
        <React.Fragment key={i}>
          <Line
            points={[
              (i + 1) * cellWidth,
              0,
              (i + 1) * cellWidth,
              cellHeight * gridSize,
            ]}
            stroke="gray"
            strokeWidth={0.5}
            dash={[5, 5]}
          />
          <Line
            points={[
              0,
              (i + 1) * cellHeight,
              cellWidth * gridSize,
              (i + 1) * cellHeight,
            ]}
            stroke="gray"
            strokeWidth={0.5}
            dash={[5, 5]}
          />
        </React.Fragment>
      ))}
    </Layer>
  );
};

const MemoGridLayer = React.memo(GridLayer);

const SceneObjectsUI: React.FC = () => {
  const [images, setImages] = useState<ImageObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [, setAndOrToggle] = useState('AND');
  const [isEnabled, setIsEnabled] = useState(true);
  const [draggedItem, setDraggedItem] = useState<IconType | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLImageElement>,
    item: IconType,
  ) => {
    setDraggedItem(item);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!stageRef.current || !draggedItem) return;

      const stage = stageRef.current;
      stage.setPointersPositions(e);
      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;

      const newImage: ImageObject = {
        id: `img-${Date.now()}`,
        x: pointerPosition.x,
        y: pointerPosition.y,
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        rotation: 0,
        src: draggedItem.src,
      };

      setImages((prev) => [...prev, newImage]);
      setSelectedId(newImage.id);
    },
    [draggedItem],
  );

  const handleClear = () => {
    setImages([]);
    setSelectedId(null);
  };

  const handleReset = () => {
    handleClear();
    setAndOrToggle('AND');
    setIsEnabled(true);
  };

  const checkDeselect = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
  ) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <div className="mx-auto">
      <div className="gap-[1px] grid grid-cols-11">
        {ObjectList.map((icon) => (
          <img
            key={icon.id}
            src={icon.src}
            alt={icon.alt}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, icon)}
            className="w-6 h-6 cursor-pointer"
          />
        ))}
      </div>
      {/* Canvas */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="shadow-sm p-2 border border-red-400 rounded"
      >
        <h1 className="font-semibold text-center text-red-600">
          Objects in Scene
        </h1>
        <div className="flex justify-between items-center p-1">
          <div className="flex flex-row text-red-600">
            <span className="mr-1 text-xs">Objects in</span>
            <div className="flex items-center gap-1 text-xs">
              <input
                type="radio"
                id="AND"
                name="ANDOR"
                value="AND"
                className="w-3 h-3"
              />
              <label htmlFor="AND" className="mr-2">
                AND
              </label>
              <input
                type="radio"
                id="OR"
                name="ANDOR"
                value="OR"
                className="w-3 h-3"
              />
              <label htmlFor="OR">OR</label>
            </div>
          </div>
          <label className="flex items-center text-xs">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={() => setIsEnabled(!isEnabled)}
              className="mr-2 w-3 h-3"
            />
            Enabled
          </label>
        </div>
        {/* Canvas */}
        <Stage
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={stageRef}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          style={{ border: '1px solid #d9d9d9', borderRadius: '4px 4px 0 0' }}
        >
          <MemoGridLayer
            cellWidth={CELL_WIDTH}
            cellHeight={CELL_HEIGHT}
            gridSize={GRID_SIZE}
          />
          <Layer>
            {images.map((image) => (
              <URLImage
                key={image.id}
                image={image}
                isSelected={image.id === selectedId}
                onSelect={() => setSelectedId(image.id)}
                onChange={(newAttrs) => {
                  setImages(
                    images.map((img) =>
                      img.id === image.id ? { ...img, ...newAttrs } : img,
                    ),
                  );
                }}
              />
            ))}
          </Layer>
        </Stage>
        <textarea
          className="border-gray-300 p-1 border rounded-b w-full h-12 text-xs"
          placeholder="Max Obj: e.g.: 2 person 3 car 0 dog, means at most 2 persons, 3 cars, no dogs"
        />
        <div className="flex justify-start gap-2 mt-1">
          <button
            onClick={handleClear}
            className="p-2 border border-red-500 rounded text-red-500"
          >
            <FaTrash />
          </button>
          <button
            onClick={handleReset}
            className="p-2 border border-blue-500 rounded text-blue-500"
          >
            <FaUndo />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SceneObjectsUI;
