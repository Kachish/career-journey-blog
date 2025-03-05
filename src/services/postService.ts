
import { supabase } from "@/integrations/supabase/client";

export interface PostComment {
  id: string;
  post_id: string;
  name: string;
  message: string;
  created_at: string;
}

export interface PostInteraction {
  id: string;
  post_id: string;
  type: 'like' | 'love' | 'insightful' | 'celebrate';
  name?: string;
  created_at: string;
}

export async function getPostComments(postId: string): Promise<PostComment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  
  return data || [];
}

export async function addComment(postId: string, name: string, message: string): Promise<PostComment | null> {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id: postId, name, message }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding comment:', error);
    return null;
  }
  
  return data;
}

export async function getPostInteractions(postId: string): Promise<{ [key: string]: number }> {
  const { data, error } = await supabase
    .from('post_interactions')
    .select('type')
    .eq('post_id', postId);
  
  if (error) {
    console.error('Error fetching interactions:', error);
    return { like: 0, love: 0, insightful: 0, celebrate: 0 };
  }
  
  // Count interactions by type
  const counts: { [key: string]: number } = { like: 0, love: 0, insightful: 0, celebrate: 0 };
  data.forEach((interaction) => {
    counts[interaction.type] = (counts[interaction.type] || 0) + 1;
  });
  
  return counts;
}

export async function addInteraction(postId: string, type: 'like' | 'love' | 'insightful' | 'celebrate', name?: string): Promise<boolean> {
  const { error } = await supabase
    .from('post_interactions')
    .insert([{ post_id: postId, type, name }]);
  
  if (error) {
    console.error('Error adding interaction:', error);
    return false;
  }
  
  return true;
}

// Add function to sync local posts to Supabase
export async function syncPostToSupabase(post: any): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .upsert([{
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.coverImage,
      category: post.category,
      author_name: post.author.name,
      author_avatar: post.author.avatar,
      date: new Date(post.date).toISOString()
    }], { onConflict: 'slug' });
  
  if (error) {
    console.error('Error syncing post:', error);
    return false;
  }
  
  return true;
}
