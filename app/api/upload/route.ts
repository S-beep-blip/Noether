import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define the path where you want to save the file
    // You might want to use a more robust method for generating unique filenames
    // and handling different file types and potential security issues.
    const uploadDir = join(process.cwd(), 'uploads'); // Example: save to an 'uploads' directory in the project root
    const filePath = join(uploadDir, file.name);
    console.log(filePath) // Example: save to an 'uploads' directory in the project root

    // Ensure the upload directory exists (optional, but good practice)
    // await mkdir(uploadDir, { recursive: true }); // Requires 'fs' import

    await writeFile(filePath, buffer);

    return Response.json({ success: true, filePath });
  } catch (error) {
    console.error('Error saving file:', error);
    return Response.json({ error: 'Failed to save file.' }, { status: 500 });
  }
}