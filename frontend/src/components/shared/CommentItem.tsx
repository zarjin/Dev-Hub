import React, { useState } from 'react';
import { Comment } from '../../features/tasks/task.types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { formatRelativeTime } from '../../lib/utils';
import { MessageSquare, CornerDownRight, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema, CommentFormData } from '../../schemas/task.schema';

export interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onReply?: (parentId: string, text: string) => void;
  className?: string;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onReply,
  className,
}) => {
  const [isReplying, setIsReplying] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: '',
      parentId: comment._id,
    },
  });

  const onSubmitReply = (data: CommentFormData) => {
    if (onReply) {
      onReply(comment._id, data.text);
      reset();
      setIsReplying(false);
    }
  };

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {/* Main Comment */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-card border border-surface-border">
        <Avatar
          src={comment.user?.avatar}
          name={comment.user?.name || 'User'}
          size="sm"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-100">
                {comment.user?.name || 'Anonymous User'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                @{comment.user?.username || 'user'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed break-words">
            {comment.text}
          </p>

          {/* Action links */}
          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-surface-border/40 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 hover:text-devhub-400 transition-colors font-medium"
            >
              <MessageSquare className="h-3 w-3" />
              Reply
            </button>
            {comment.userId === currentUserId && (
              <span className="text-slate-400 text-[10px]">Author</span>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <form onSubmit={handleSubmit(onSubmitReply)} className="mt-3 pt-3 border-t border-surface-border">
              <div className="flex gap-2">
                <input
                  {...register('text')}
                  placeholder={`Reply to ${comment.user?.name || 'user'}...`}
                  className="flex-1 bg-surface-elevated border border-surface-borderLight rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-devhub-500"
                />
                <Button size="sm" type="submit" isLoading={isSubmitting} leftIcon={<Send className="h-3 w-3" />}>
                  Post
                </Button>
                <Button size="sm" variant="ghost" type="button" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
              </div>
              {errors.text && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.text.message}</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-6 border-l-2 border-surface-border space-y-2.5 ml-4">
          {comment.replies.map((reply) => (
            <div
              key={reply._id}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated/60 border border-surface-border/70"
            >
              <CornerDownRight className="h-3.5 w-3.5 text-devhub-400 flex-shrink-0 mt-2" />
              <Avatar
                src={reply.user?.avatar}
                name={reply.user?.name || 'User'}
                size="xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200">
                      {reply.user?.name || 'User'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      @{reply.user?.username || 'user'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatRelativeTime(reply.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed break-words">
                  {reply.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
