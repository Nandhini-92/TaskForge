import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { OrgScoped } from '../../common/decorators/org-scoped.decorator';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @OrgScoped()
  @Post('task-suggestions')
  async generateTaskSuggestions(
    @Body()
    body: {
      title: string;
      description?: string;
    },
  ) {
    return this.aiService.generateTaskSuggestions(body);
  }
}