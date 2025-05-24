import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

import { NextResponse } from 'next/server';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { filePath } = await request.json();

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    const absoluteFilePath = path.resolve(filePath);
    const file = await ai.files.upload({
      file: absoluteFilePath as string,
    });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          'Please transcribe this file without any additional information, if the file includes images then please add the image description and continue transcribing the file.',
          createPartFromUri(file.uri!, file.mimeType!),
        ]),
      ],
    });
    console.log(response.text);
    
    return NextResponse.json({ summary: response.text });

  } catch (error: any) {
    console.error('Error processing file with Gemini:', error);
    return NextResponse.json({ error: `Error processing file with Gemini: ${error.message}` }, { status: 500 });
  }
}