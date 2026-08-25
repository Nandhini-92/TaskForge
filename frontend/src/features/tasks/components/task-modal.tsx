'use client';

import { Sparkles } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

import { useAuthStore } from '@/store/auth.store';
import { useCreateTask, useUpdateTask } from '@/features/tasks/hooks/useTasks';
import { useOrgMembers } from '@/features/organizations/hooks/useOrganizations';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useOptionalDashboardModals } from '@/components/layout/dashboard-modals-context';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select } from '@/components/ui/select';

import { TaskStatus, TaskPriority } from '@/types';
import type { Task } from '@/types';

import {
  formatTaskStatus,
  formatTaskPriority,
} from '@/lib/utils';

/** Sentinel value for project dropdown */
export const TASK_MODAL_CREATE_PROJECT_VALUE =
  '__tf_create_project__';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  task?: Task;
  defaultStatus?: TaskStatus;
}

interface AiSuggestion {
  description?: string;
  priority?: TaskPriority;
  subtasks?: string[];
  estimatedEffort?: 'small' | 'medium' | 'large';
  reasoning?: string;
}

export function TaskModal({
  isOpen,
  onClose,
  projectId,
  task,
  defaultStatus,
}: TaskModalProps) {
  const isEdit = !!task;

  const dashboardModals =
    useOptionalDashboardModals();

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const { data: members } = useOrgMembers();
  const { data: projectsData } = useProjects();

  const projects = projectsData?.data;

  const [selectedProjectId, setSelectedProjectId] =
    useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [status, setStatus] =
    useState<TaskStatus>(TaskStatus.TODO);

  const [priority, setPriority] =
    useState<TaskPriority>(TaskPriority.MEDIUM);

  const [assignedTo, setAssignedTo] =
    useState('');

  const [dueDate, setDueDate] =
    useState('');

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [aiError, setAiError] =
    useState('');

  const [aiSubtasks, setAiSubtasks] =
    useState<string[]>([]);

  const [estimatedEffort, setEstimatedEffort] =
    useState('');

  const [aiReasoning, setAiReasoning] =
    useState('');

  const projectSelectOptions = useMemo(() => {
    const rows =
      projects?.map((p) => ({
        value: p.id,
        label: p.name,
      })) ?? [];

    if (isEdit || projectId) {
      return rows;
    }

    if (
      rows.length === 0 &&
      dashboardModals
    ) {
      return [
        {
          value:
            TASK_MODAL_CREATE_PROJECT_VALUE,
          label: '+ Create project',
        },
      ];
    }

    return rows;
  }, [
    projects,
    isEdit,
    projectId,
    dashboardModals,
  ]);

  function handleProjectChange(value: string) {
    if (
      value ===
      TASK_MODAL_CREATE_PROJECT_VALUE
    ) {
      onClose();

      queueMicrotask(() => {
        dashboardModals?.openProjectModal();
      });

      return;
    }

    setSelectedProjectId(value);
  }

  function resetForm() {
    setSelectedProjectId(
      projectId || task?.projectId || '',
    );

    setTitle(task?.title || '');

    setDescription(
      task?.description || '',
    );

    setStatus(
      task?.status ||
        defaultStatus ||
        TaskStatus.TODO,
    );

    setPriority(
      task?.priority ||
        TaskPriority.MEDIUM,
    );

    setAssignedTo(
      task?.assignedTo || '',
    );

    setDueDate(
      task?.dueDate || '',
    );

    setAiError('');
    setAiSubtasks([]);
    setEstimatedEffort('');
    setAiReasoning('');
  }

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [
    isOpen,
    task,
    projectId,
    defaultStatus,
  ]);

  async function handleGenerateWithAI() {
    try {
      setIsGenerating(true);
      setAiError('');

      const {
        accessToken,
        currentOrganizationId,
      } = useAuthStore.getState();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/task-suggestions`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            ...(accessToken
              ? {
                  Authorization:
                    `Bearer ${accessToken}`,
                }
              : {}),

            ...(currentOrganizationId
              ? {
                  'x-organization-id':
                    currentOrganizationId,
                }
              : {}),
          },

          body: JSON.stringify({
            title,
            description,
          }),
        },
      );

      const responseText =
        await response.text();

      console.log(
        '========== AI RESPONSE ==========',
      );

      console.log(
        'STATUS:',
        response.status,
      );

      console.log(
        'BODY:',
        responseText,
      );

      console.log(
        '=================================',
      );

      if (!response.ok) {
        let errorMessage =
          'Failed to generate AI suggestions';

        try {
          const errorData =
            JSON.parse(responseText);

          console.error(
            'AI ERROR DATA:',
            errorData,
          );

          if (
            typeof errorData?.message ===
            'string'
          ) {
            errorMessage =
              errorData.message;
          } else if (responseText) {
            errorMessage =
              responseText;
          }
        } catch {
          if (responseText) {
            errorMessage =
              responseText;
          }
        }

        setAiError(errorMessage);
        return;
      }

      let responseData: any;

      try {
        responseData =
          JSON.parse(responseText);
      } catch {
        setAiError(
          'AI returned an invalid response',
        );
        return;
      }

      console.log(
        'AI SUCCESS DATA:',
        responseData,
      );

      const suggestions:
        | AiSuggestion
        | undefined =
        responseData?.data ??
        responseData;

      if (!suggestions) {
        setAiError(
          'AI did not return any suggestions',
        );
        return;
      }

      // APPLY DESCRIPTION
      if (
        typeof suggestions.description ===
        'string'
      ) {
        setDescription(
          suggestions.description,
        );
      }

      // APPLY PRIORITY
      if (
        suggestions.priority &&
        Object.values(TaskPriority).includes(
          suggestions.priority,
        )
      ) {
        setPriority(
          suggestions.priority,
        );
      }

      // STORE SUBTASKS
      if (
        Array.isArray(
          suggestions.subtasks,
        )
      ) {
        setAiSubtasks(
          suggestions.subtasks,
        );
      }

      // STORE ESTIMATED EFFORT
      if (
        suggestions.estimatedEffort
      ) {
        setEstimatedEffort(
          suggestions.estimatedEffort,
        );
      }

      // STORE AI REASONING
      if (
        suggestions.reasoning
      ) {
        setAiReasoning(
          suggestions.reasoning,
        );
      }

      console.log(
        'AI suggestions applied successfully',
      );
    } catch (error) {
      console.error(
        '========== AI REQUEST ERROR ==========',
      );

      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to generate AI suggestions';

      setAiError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    const trimmedTitle =
      title.trim();

    if (!trimmedTitle) {
      return;
    }

    if (isEdit) {
      updateTask.mutate(
        {
          id: task!.id,

          payload: {
            title: trimmedTitle,

            description:
              description.trim() ||
              undefined,

            status,

            priority,

            assignedTo:
              assignedTo
                ? assignedTo
                : null,

            dueDate:
              dueDate || undefined,
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      if (!selectedProjectId) {
        return;
      }

      createTask.mutate(
        {
          projectId:
            selectedProjectId,

          payload: {
            title: trimmedTitle,

            description:
              description.trim() ||
              undefined,

            status,

            priority,

            assignedTo:
              assignedTo ||
              undefined,

            dueDate:
              dueDate || undefined,
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
  }

  const isPending =
    createTask.isPending ||
    updateTask.isPending;

  const error =
    createTask.error ||
    updateTask.error;

  const canSubmit =
    title.trim() &&
    (isEdit ||
      selectedProjectId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? 'Edit Task'
          : 'Create Task'
      }
      size="lg"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="task-form"
            loading={isPending}
            disabled={!canSubmit}
          >
            {isEdit
              ? 'Save'
              : 'Create'}
          </Button>
        </>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          Failed to{' '}
          {isEdit
            ? 'update'
            : 'create'}{' '}
          task. Please try again.
        </div>
      )}

      <form
        id="task-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {!isEdit &&
          !projectId && (
            <Select
              id="task-project"
              label="Project"
              value={
                selectedProjectId
              }
              onChange={
                handleProjectChange
              }
              placeholder={
                projectSelectOptions.length ===
                0
                  ? 'No projects yet'
                  : 'Select a project'
              }
              options={
                projectSelectOptions
              }
            />
          )}

        <Input
          id="task-title"
          label="Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value,
            )
          }
          placeholder="Task title"
          autoFocus
        />

        <Textarea
          id="task-desc"
          label="Description (optional)"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value,
            )
          }
          rows={3}
        />

        <div className="flex flex-col items-start gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={
              handleGenerateWithAI
            }
            loading={isGenerating}
            disabled={
              !title.trim() ||
              isGenerating
            }
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>

          {aiError && (
            <p className="text-sm text-red-600">
              {aiError}
            </p>
          )}
        </div>

        {aiSubtasks.length > 0 && (
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">
              AI Suggested Subtasks
            </h3>

            <ul className="list-disc space-y-1 pl-5 text-sm">
              {aiSubtasks.map(
                (subtask, index) => (
                  <li key={index}>
                    {subtask}
                  </li>
                ),
              )}
            </ul>
          </div>
        )}

        {estimatedEffort && (
          <div className="rounded-lg border p-4">
            <p className="text-sm">
              <strong>
                Estimated effort:
              </strong>{' '}
              {estimatedEffort}
            </p>
          </div>
        )}

        {aiReasoning && (
          <div className="rounded-lg border p-4">
            <p className="text-sm">
              <strong>
                AI reasoning:
              </strong>{' '}
              {aiReasoning}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="task-status"
            label="Status"
            value={status}
            onChange={(v) =>
              setStatus(
                v as TaskStatus,
              )
            }
            options={Object.values(
              TaskStatus,
            ).map((s) => ({
              value: s,
              label:
                formatTaskStatus(s),
            }))}
          />

          <Select
            id="task-priority"
            label="Priority"
            value={priority}
            onChange={(v) =>
              setPriority(
                v as TaskPriority,
              )
            }
            options={Object.values(
              TaskPriority,
            ).map((p) => ({
              value: p,
              label:
                formatTaskPriority(p),
            }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="task-assignee"
            label="Assignee"
            value={assignedTo}
            onChange={
              setAssignedTo
            }
            placeholder="Unassigned"
            options={[
              {
                value: '',
                label:
                  'Unassigned',
              },

              ...(members?.map(
                (m) => ({
                  value: m.userId,
                  label: m.user
                    ? `${m.user.firstName} ${m.user.lastName}`
                    : m.userId,
                }),
              ) ?? []),
            ]}
          />

          <DatePicker
            id="task-due"
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
            placeholder="mm/dd/yyyy"
          />
        </div>
      </form>
    </Modal>
  );
}