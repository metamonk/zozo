import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from './ui/button'

interface Caption {
  text: string;
  fontSize: number;
  verticalPosition: number;
  fontColor: string;
  randomColors: boolean;
}

const Generator: React.FC = () => {
  const [background, setBackground] = useState<string | null>('/images/bg.png');
  const [foreground, setForeground] = useState<string | null>(null);
  const [staticImage] = useState<string>('/images/zozo-no-bg.png'); // Add this line
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([
    {
      text: 'zoned', fontSize: 80, verticalPosition: 15, fontColor: '#ffffff', randomColors: false
    },
    {
      text: 'out', fontSize: 90, verticalPosition: 70, fontColor: '##ffffff', randomColors: false
    },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve();
        };
        img.src = src;
      });
    };

    const drawLayers = async () => {
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (background) {
        await drawImage(background);
      }

      // Draw static image
      await drawImage(staticImage);

      // Draw foreground image if it exists
      if (foreground) {
        await drawImage(foreground);
      }

      // Draw captions
      captions.forEach(caption => {
        if (caption.text) {
          const yPosition = (canvas.height * caption.verticalPosition) / 100;

          // Set font properties
          ctx.font = `${caption.fontSize}px Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          if (caption.randomColors) {
            // Draw text with random colors per letter
            let x = canvas.width / 2;
            const letters = caption.text.split('');
            const totalWidth = ctx.measureText(caption.text).width;
            x -= totalWidth / 2;

            letters.forEach(letter => {
              ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
              const letterWidth = ctx.measureText(letter).width;
              ctx.fillText(letter, x + letterWidth / 2, yPosition);
              x += letterWidth;
            });
          } else {
            // Draw text with selected font color
            ctx.fillStyle = caption.fontColor;
            ctx.fillText(caption.text, canvas.width / 2, yPosition);
          }
        }
      });
    };

    drawLayers();
  }, [backgroundColor, background, foreground, staticImage, captions]);

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setBackground(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleForegroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setForeground(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meme.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
  };

  const removeBackgroundColor = () => {
    setBackgroundColor(null);
  };

  return (
    <div className="mx-auto mt-16 flex flex-col gap-8 relative z-10">
      <div className=''>
        <Link href="/">
          <Button>
            Back    
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width="600"
          height="600"
          className="w-full max-w-[600px] aspect-square mb-4 border-2 border-gray-300"
        ></canvas>
        <div className="w-full p-2 bg-gray-100">
          <div className="control-category mb-4">
            <div className="p-2 bg-gray-100">
              <label className="text-xl font-bold">Background</label>
            </div>
            <div className="flex items-center mb-4">
              <label className="mr-2">Background Color:</label>
              <input
                type="color"
                value={backgroundColor || '#FFFFFF'}
                onChange={handleBackgroundColorChange}
                className="w-12 h-12 p-0 border-none outline-none cursor-pointer"
              />
              <button
                onClick={removeBackgroundColor}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Remove BG Color
              </button>
            </div>
            <label className="block w-full py-4 px-6 text-center text-lg font-semibold text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              Upload Background Image
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="control-category mb-4">
            <div className="p-2 bg-gray-100">
              <label className="text-xl font-bold">Foreground</label>
            </div>
            <label className="block w-full py-4 px-6 text-center text-lg font-semibold text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              Upload Foreground Image
              <input
                type="file"
                accept="image/*"
                onChange={handleForegroundUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Caption Controls */}
          {captions.map((caption, index) => (
            <div key={index} className="control-category mb-4">
              <label className="block mb-2">Caption {index + 1}:</label>
              <input
                type="text"
                value={caption.text}
                onChange={(e) => {
                  const newCaptions = [...captions];
                  newCaptions[index].text = e.target.value;
                  setCaptions(newCaptions);
                }}
                placeholder="Enter caption"
                className="w-full p-2 border rounded mb-2"
              />
              <div className="flex items-center mb-2">
                <label className="mr-2">Size:</label>
                <input
                  type="number"
                  value={caption.fontSize}
                  onChange={(e) => {
                    const newCaptions = [...captions];
                    newCaptions[index].fontSize = Number(e.target.value);
                    setCaptions(newCaptions);
                  }}
                  placeholder="Font size"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex flex-col mb-2">
                <label htmlFor={`captionPosition-${index}`}>Vertical Position:</label>
                <input
                  id={`captionPosition-${index}`}
                  type="range"
                  min={0}
                  max={100}
                  value={caption.verticalPosition}
                  onChange={(e) => {
                    const newCaptions = [...captions];
                    newCaptions[index].verticalPosition = Number(e.target.value);
                    setCaptions(newCaptions);
                  }}
                  className="w-full"
                />
              </div>
              <div className="flex items-center mb-2">
                <label className="mr-2">Font Color:</label>
                <input
                  type="color"
                  value={caption.fontColor}
                  onChange={(e) => {
                    const newCaptions = [...captions];
                    newCaptions[index].fontColor = e.target.value;
                    setCaptions(newCaptions);
                  }}
                  className="w-12 h-12 p-0 border-none outline-none cursor-pointer"
                />
                <label className="ml-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={caption.randomColors}
                    onChange={(e) => {
                      const newCaptions = [...captions];
                      newCaptions[index].randomColors = e.target.checked;
                      setCaptions(newCaptions);
                    }}
                    className="mr-2"
                  />
                  Random Colors
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={handleSaveImage}
            className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Save Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Generator;