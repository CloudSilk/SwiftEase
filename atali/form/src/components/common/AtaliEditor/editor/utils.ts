import { getToken, Code } from "@swiftease/atali-pkg";

type UploadResponse = {
  code: number
  message: string
  fileID?: string
};

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/core/file/upload', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonResponse: UploadResponse = await response.json();

    return jsonResponse;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return { code: Code.InternalServerError, message: 'There was a problem uploading the file' };
  }
}

// Usage:
// const inputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
// inputElement.addEventListener('change', async (event) => {
//   const target = event.target as HTMLInputElement;
//   const file = target.files?.[0];

//   if (!file) {
//     return;
//   }

//   const result = await uploadFile(file);

//   if (result.success) {
//     console.log('File uploaded successfully:', result.data?.fileUrl);
//   } else {
//     console.error('File upload failed:', result.error);
//   }
// });
