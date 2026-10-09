import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchTaskById,
  updateTaskStatus,
  reviewTaskAction,
  fetchTaskActivities,
  fetchTaskComments,
  addCommentToTask,
} from '../../features/tasks/taskSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { UserAvatar } from '../../components/common/UserAvatar';
import { CommentItem } from '../../components/shared/CommentItem';
import { ActivityFeed } from '../../components/shared/ActivityFeed';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import {
  Calendar,
  CheckCircle2,
  Clock,
  RotateCw,
  AlertOctagon,
  MessageSquare,
  Activity,
  Send,
  AlertTriangle,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedTask, activities, comments } = useAppSelector(
    (state) => state.task
  );
  const { user } = useAppSelector((state) => state.auth);
  const { members } = useAppSelector((state) => state.team);

  const [commentText, setCommentText] = useState('');
  const [requestChangesModalOpen, setRequestChangesModalOpen] = useState(false);
  const [changesFeedback, setChangesFeedback] = useState('');

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId));
      dispatch(fetchTaskActivities(taskId));
      dispatch(fetchTaskComments(taskId));
    }
  }, [dispatch, taskId]);

  if (!selectedTask) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-400">Loading task details...</p>
      </div>
    );
  }

  // Determine current user team role
  const teamMember = members.find((m) => m.userId === user?._id);
  const isTeamLead = teamMember?.role === 'team_lead' || user?.username === 'zarjin';
  const isAssignee = selectedTask.assignedTo === user?._id;

  // Workflow enforcement rules
  const canStartTask = selectedTask.status === 'todo';
  const canSubmitForReview =
    selectedTask.status === 'in_progress' || selectedTask.status === 'changes_requested';
  const isPendingReview = selectedTask.status === 'pending_review';

  // Rule: Developer must NOT approve their own task
  const canApprove = isPendingReview && isTeamLead && !isAssignee;
  const canRequestChanges = isPendingReview && isTeamLead;

  const handleStartWorking = () => {
    if (!user) return;
    dispatch(
      updateTaskStatus({
        id: selectedTask._id,
        status: 'in_progress',
        actorId: user._id,
      })
    );
  };

  const handleSubmitForReview = () => {
    if (!user) return;
    dispatch(
      updateTaskStatus({
        id: selectedTask._id,
        status: 'pending_review',
        actorId: user._id,
      })
    );
  };

  const handleApprove = () => {
    if (!user) return;
    dispatch(
      reviewTaskAction({
        id: selectedTask._id,
        review: { action: 'approve' },
        actorId: user._id,
      })
    );
  };

  const handleConfirmChanges = () => {
    if (!user) return;
    dispatch(
      reviewTaskAction({
        id: selectedTask._id,
        review: { action: 'request_changes', feedback: changesFeedback },
        actorId: user._id,
      })
    );
    setRequestChangesModalOpen(false);
    setChangesFeedback('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    dispatch(
      addCommentToTask({
        dto: { taskId: selectedTask._id, text: commentText.trim() },
        userId: user._id,
      })
    );
    setCommentText('');
  };

  const handleReplyComment = (parentId: string, text: string) => {
    if (!user || !text.trim()) return;
    dispatch(
      addCommentToTask({
        dto: { taskId: selectedTask._id, text, parentId },
        userId: user._id,
      })
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to tasks</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Task #{selectedTask._id}</span>
        </div>
      </div>

      {/* Main Grid: Details + Workflow Action Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Task Content, Review Controls, Discussion */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Task Header Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={selectedTask.status} size="md" />
              <PriorityBadge priority={selectedTask.priority} size="md" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {selectedTask.title}
            </h1>

            <div className="mt-4 pt-4 border-t border-surface-border">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Description &amp; Acceptance Criteria
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedTask.description}
              </p>
            </div>
          </Card>

          {/* Workflow Action Bar */}
          <Card className="p-5 border-devhub-500/30 bg-devhub-950/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-devhub-400" />
                  <h3 className="text-sm font-bold text-white">Workflow Pipeline</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Current state:{' '}
                  <span className="font-semibold text-slate-200 uppercase font-mono">
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                </p>
              </div>

              {/* Dynamic Action Buttons according to role & state */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {canStartTask && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleStartWorking}
                    leftIcon={<RotateCw className="h-3.5 w-3.5" />}
                  >
                    Start Working
                  </Button>
                )}

                {canSubmitForReview && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSubmitForReview}
                    leftIcon={<Clock className="h-3.5 w-3.5" />}
                  >
                    Submit For Review
                  </Button>
                )}

                {isPendingReview && (
                  <>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={handleApprove}
                      disabled={!canApprove}
                      leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                      title={
                        isAssignee
                          ? 'Developers cannot approve their own task'
                          : !isTeamLead
                          ? 'Only team leads can approve tasks'
                          : 'Approve task'
                      }
                    >
                      Approve Task
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setRequestChangesModalOpen(true)}
                      disabled={!canRequestChanges}
                      leftIcon={<AlertOctagon className="h-3.5 w-3.5" />}
                    >
                      Request Changes
                    </Button>
                  </>
                )}

                {selectedTask.status === 'completed' && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Task Approved &amp; Completed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Warning if developer tries to approve own task */}
            {isPendingReview && isAssignee && (
              <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>
                  You are the assignee of this task. Per DevHub engineering protocol, another team lead must review and approve this work.
                </span>
              </div>
            )}
          </Card>

          {/* Comments and Discussion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-devhub-400" />
                <span>Discussion &amp; Reviews ({comments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* New Comment Input */}
              <form onSubmit={handlePostComment} className="space-y-2">
                <Textarea
                  placeholder="Leave a comment, code review note, or question..."
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!commentText.trim()}
                    leftIcon={<Send className="h-3.5 w-3.5" />}
                  >
                    Post Comment
                  </Button>
                </div>
              </form>

              {/* Threaded Comment List */}
              <div className="space-y-4 pt-4 border-t border-surface-border">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No comments yet. Start the conversation!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      currentUserId={user?._id}
                      onReply={handleReplyComment}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Metadata, Assignee, Activity Timeline */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Assignee</span>
                <UserAvatar user={selectedTask.assignee} showName={true} size="md" />
              </div>

              <div className="pt-3 border-t border-surface-border">
                <span className="text-slate-400 block mb-1">Created By</span>
                <UserAvatar user={selectedTask.creator} showName={true} size="sm" />
              </div>

              <div className="pt-3 border-t border-surface-border grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block mb-1">Due Date</span>
                  <span className="font-mono text-slate-200 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {formatDate(selectedTask.dueDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Created</span>
                  <span className="font-mono text-slate-200">
                    {formatDate(selectedTask.createdAt)}
                  </span>
                </div>
              </div>

              {selectedTask.completedAt && (
                <div className="pt-3 border-t border-surface-border">
                  <span className="text-slate-400 block mb-1">Completed At</span>
                  <span className="font-mono text-emerald-400">
                    {formatDate(selectedTask.completedAt)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-devhub-400" />
                <span>Audit Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={activities} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request Changes Modal */}
      <Modal
        isOpen={requestChangesModalOpen}
        onClose={() => setRequestChangesModalOpen(false)}
        title="Request Changes"
        description="Provide actionable feedback for the developer to revise this task."
        maxWidth="md"
      >
        <div className="space-y-4">
          <Textarea
            label="Revision Notes"
            placeholder="e.g. Please add unit tests and ensure color contrast passes WCAG AA..."
            rows={4}
            value={changesFeedback}
            onChange={(e) => setChangesFeedback(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setRequestChangesModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirmChanges}
              disabled={!changesFeedback.trim()}
            >
              Submit Changes Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
