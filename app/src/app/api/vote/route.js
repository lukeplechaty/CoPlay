import { NextResponse } from 'next/server';
import { setVote, removeVote, getVoteCounts, getUser } from '@/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(req) {
  const { video_id, direction } = await req.json();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const user = await getUser(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (direction === null) {
    await removeVote(video_id, user.id);
  } else {
    await setVote(video_id, user.id, direction === 'up');
  }
  const counts = await getVoteCounts(video_id);
  return NextResponse.json({
    upvotes: counts.upvotes,
    downvotes: counts.downvotes,
    userVote: direction === null ? null : direction === 'up',
  });
} 