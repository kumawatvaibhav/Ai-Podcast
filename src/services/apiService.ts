export interface VoiceOption {
  id: string;
  name: string;
  preview?: string;
}

export interface GeneratedScript {
  title: string;
  content: string;
}

// Sample voices from ElevenLabs
export const voiceOptions: VoiceOption[] = [
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte" },
];


const GROK_API_KEY = "xai-rXr4LX1eDUXmhX8xwKQdKbtII6pmVN4y7vVE5C1KVSP787LSUdpl2oAN3PePGnDOQF5DeMgTGEVXl7ag";

export async function generateScript(topic: string): Promise<GeneratedScript> {
  // Check if API key is available
  if (!GROK_API_KEY) {
    console.warn("No Grok API key found, using mock script generation");
    return mockGenerateScript(topic);
  }

  try {
    
    const response = await fetch("https://api.grok.ai/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-1",
        prompt: `Write a professional podcast script about ${topic}. Include a title and structure it with sections including an introduction, main discussion points, and conclusion.`,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the generated content
    const content = data.choices[0].text;
    

    let title = `Exploring ${topic}`;
    const titleMatch = content.match(/^#\s*(.*?)$/m);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1];
    }

    return {
      title,
      content
    };
  } catch (error) {
    console.error("Error generating script with Grok:", error);
    // Fall back to mock generation in case of error
    return mockGenerateScript(topic);
  }
}

// Mock script generator for fallback
function mockGenerateScript(topic: string): Promise<GeneratedScript> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const script = {
        title: `Exploring ${topic}`,
        content: generateMockScript(topic),
      };
      resolve(script);
    }, 1500);
  });
}

// Function to generate audio from text using ElevenLabs
export async function generateAudio(
  text: string, 
  voiceId: string, 
  apiKey: string
): Promise<string> {
  if (!apiKey || !voiceId || !text) {
    throw new Error("Missing required parameters for audio generation");
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `ElevenLabs API error: ${response.status} ${JSON.stringify(errorData)}`
      );
    }

    // Get audio data as blob
    const audioBlob = await response.blob();
    
    // Create a local URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
}

// Mock script generator for demo purposes
function generateMockScript(topic: string): string {
  return `
# ${topic}: A Deep Dive

## Introduction
Welcome to today's episode where we explore the fascinating world of ${topic}. I'm your host, and today we'll journey through the history, current state, and future possibilities of this intriguing subject.

## Background
${topic} has been a subject of interest for many years. Experts in fields ranging from technology to philosophy have contemplated its significance and impact on our daily lives.

## Main Discussion
When we think about ${topic}, several key aspects come to mind:

1. The historical context and how it evolved over time
2. Current applications and use cases
3. Challenges and controversies surrounding it
4. Future potential and where it might lead us

## Expert Perspectives
Many thought leaders have shared valuable insights on ${topic}. As Dr. Jane Smith from the Institute of Advanced Studies puts it, "${topic} represents not just a technological advancement, but a fundamental shift in how we perceive our relationship with information."

## Practical Applications
For the average person, ${topic} offers several practical benefits:
- Enhanced efficiency in daily tasks
- New opportunities for learning and growth
- Improved decision-making capabilities
- Novel entertainment experiences

## Looking Ahead
As we look to the future, ${topic} is poised to transform in ways we can hardly imagine. The next decade will likely bring breakthroughs that reshape our understanding and implementation.

## Conclusion
Thank you for joining me on this exploration of ${topic}. Until next time, keep curious and stay informed.
`;
}
