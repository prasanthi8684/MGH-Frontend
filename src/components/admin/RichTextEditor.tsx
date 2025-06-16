import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const customConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'alignment',
        '|',
        'link',
        'imageUpload',
        'insertTable',
        '|',
        'mathFormula',
        '|',
        'undo',
        'redo'
      ],
      shouldNotGroupWhenFull: true
    },
    image: {
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'resizeImage'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
      ]
    },
    math: {
      engine: 'mathjax',
      outputType: 'script',
      forceOutputType: true,
      enablePreview: true
    }
  };

  // MongoDB upload adapter
  const uploadAdapter = (loader: any) => {
    return {
      upload: async () => {
        setIsUploading(true);
        try {
          const file = await loader.file;
          const formData = new FormData();
          formData.append('file', file);

          // Replace with your MongoDB file upload API endpoint
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Image upload failed');
          }

          return { default: data.publicUrl }; // MongoDB returns a URL for the uploaded file
        } catch (error) {
          console.error('Upload failed:', error);
          throw error;
        } finally {
          setIsUploading(false);
        }
      }
    };
  };

  function uploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div className="relative">
      {isUploading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      )}
      <CKEditor
        editor={ClassicEditor}
        config={{
          ...customConfig,
          extraPlugins: [uploadPlugin]
        }}
        data={value}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}
