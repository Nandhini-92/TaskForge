import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly configService: ConfigService,
  ) {}

  async generateTaskSuggestions(data: {
    title: string;
    description?: string;
  }) {
    const apiKey =
      this.configService.get<string>('GROQ_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'GROQ_API_KEY is not configured',
      );
    }

    const prompt = `
You are an AI assistant for a project management application called TaskForge.

Task title: ${data.title}

Task description: ${
      data.description || 'No description provided'
    }

Return ONLY valid JSON in this exact format:

{
  "description": "An improved short task description",
  "priority": "medium",
  "subtasks": [
    "Subtask 1",
    "Subtask 2"
  ],
  "estimatedEffort": "medium",
  "reasoning": "Short explanation"
}

Rules:
- priority must be exactly one of: low, medium, high, urgent
- maximum 5 subtasks
- estimatedEffort must be exactly one of: small, medium, large
- do not use markdown
- return valid JSON only
`;

    try {
      this.logger.log(
        '========== CALLING GROQ ==========',
      );

      this.logger.log(
        `Task title: ${data.title}`,
      );

      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey.trim()}`,
          },

          body: JSON.stringify({
            model: 'openai/gpt-oss-20b',

            messages: [
              {
                role: 'system',
                content:
                  'You are a helpful AI project management assistant. Always return valid JSON only.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],

            temperature: 0.3,

            response_format: {
              type: 'json_object',
            },
          }),
        },
      );

      // IMPORTANT: Read the body exactly once
      const responseText = await response.text();

      this.logger.log(
        `Groq status: ${response.status}`,
      );

      this.logger.log(
        `Groq response: ${responseText}`,
      );

      // GROQ REQUEST FAILED
      if (!response.ok) {
        let groqError: unknown = responseText;

        try {
          groqError = JSON.parse(responseText);
        } catch {
          // Keep raw response text
        }

        this.logger.error(
          '========== GROQ API ERROR ==========',
        );

        this.logger.error(
          `Status: ${response.status}`,
        );

        this.logger.error(
          JSON.stringify(groqError),
        );

        this.logger.error(
          '=====================================',
        );

        throw new InternalServerErrorException({
          message: groqError,
          groqStatus: response.status,
        });
      }

      // Parse the Groq API response
      let result: any;

      try {
        result = JSON.parse(responseText);
      } catch {
        this.logger.error(
          `Invalid Groq response: ${responseText}`,
        );

        throw new InternalServerErrorException(
          'Groq returned an invalid response',
        );
      }

      const content =
        result?.choices?.[0]?.message?.content;

      if (!content) {
        this.logger.error(
          `No AI content found: ${responseText}`,
        );

        throw new InternalServerErrorException(
          'AI did not return any content',
        );
      }

      this.logger.log(
        `========== AI CONTENT ==========`,
      );

      this.logger.log(content);

      this.logger.log(
        `================================`,
      );

      // Parse the AI-generated JSON
      let suggestions: any;

      try {
        suggestions = JSON.parse(content);
      } catch {
        this.logger.error(
          `AI returned invalid JSON: ${content}`,
        );

        throw new InternalServerErrorException(
          'AI returned invalid JSON',
        );
      }

      const validPriorities = [
        'low',
        'medium',
        'high',
        'urgent',
      ];

      const validEfforts = [
        'small',
        'medium',
        'large',
      ];

      return {
        description:
          typeof suggestions.description === 'string'
            ? suggestions.description
            : '',

        priority: validPriorities.includes(
          suggestions.priority,
        )
          ? suggestions.priority
          : 'medium',

        subtasks: Array.isArray(
          suggestions.subtasks,
        )
          ? suggestions.subtasks.slice(0, 5)
          : [],

        estimatedEffort: validEfforts.includes(
          suggestions.estimatedEffort,
        )
          ? suggestions.estimatedEffort
          : 'medium',

        reasoning:
          typeof suggestions.reasoning === 'string'
            ? suggestions.reasoning
            : '',
      };
    } catch (error) {
      this.logger.error(
        '========== AI SERVICE ERROR ==========',
      );

      if (error instanceof Error) {
        this.logger.error(error.message);
        this.logger.error(error.stack);
      } else {
        this.logger.error(
          JSON.stringify(error),
        );
      }

      this.logger.error(
        '========================================',
      );

      // Re-throw Nest HTTP exceptions
      if (
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Unable to generate AI suggestions',
      );
    }
  }
}