import OpenAI from 'openai';

// Initialize the OpenAI client
// It will automatically use process.env.OPENAI_API_KEY if available.
// A dummy key is provided to prevent the server from crashing on startup if the user hasn't set it yet.
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_to_prevent_crash_on_startup',
});
