
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

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
  // Ensure we're using a valid UUID for the database
  const validPostId = ensureValidUuid(postId);
  
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', validPostId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  
  return data || [];
}

export async function addComment(postId: string, name: string, message: string): Promise<PostComment | null> {
  // Ensure we're using a valid UUID for the database
  const validPostId = ensureValidUuid(postId);
  
  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id: validPostId, name, message }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding comment:', error);
    return null;
  }
  
  return data;
}

export async function getPostInteractions(postId: string): Promise<{ [key: string]: number }> {
  // Ensure we're using a valid UUID for the database
  const validPostId = ensureValidUuid(postId);
  
  const { data, error } = await supabase
    .from('post_interactions')
    .select('type')
    .eq('post_id', validPostId);
  
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
  // Ensure we're using a valid UUID for the database
  const validPostId = ensureValidUuid(postId);
  
  const { error } = await supabase
    .from('post_interactions')
    .insert([{ post_id: validPostId, type, name }]);
  
  if (error) {
    console.error('Error adding interaction:', error);
    return false;
  }
  
  return true;
}

// Add function to sync local posts to Supabase
export async function syncPostToSupabase(post: any): Promise<boolean> {
  // Generate a proper UUID if the post doesn't have one
  const postId = post.id && isValidUuid(post.id) ? post.id : uuidv4();
  
  const { error } = await supabase
    .from('posts')
    .upsert([{
      id: postId,
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

// Add functions to fetch, create, update, and delete posts
export async function getAllPosts(): Promise<any[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  
  return data || [];
}

export async function getPostById(id: string): Promise<any | null> {
  const validId = ensureValidUuid(id);
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', validId)
    .single();
  
  if (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
  
  return data;
}

export async function createPost(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: { name: string; avatar: string };
}): Promise<string | null> {
  const id = uuidv4();
  
  const { error } = await supabase
    .from('posts')
    .insert([{
      id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.coverImage,
      category: post.category,
      author_name: post.author.name,
      author_avatar: post.author.avatar,
      date: new Date().toISOString()
    }]);
  
  if (error) {
    console.error('Error creating post:', error);
    return null;
  }
  
  return id;
}

export async function updatePost(id: string, post: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  author?: { name: string; avatar: string };
}): Promise<boolean> {
  const validId = ensureValidUuid(id);
  
  const updateData: any = {};
  if (post.title) updateData.title = post.title;
  if (post.slug) updateData.slug = post.slug;
  if (post.excerpt) updateData.excerpt = post.excerpt;
  if (post.content) updateData.content = post.content;
  if (post.coverImage) updateData.cover_image = post.coverImage;
  if (post.category) updateData.category = post.category;
  if (post.author) {
    updateData.author_name = post.author.name;
    updateData.author_avatar = post.author.avatar;
  }
  
  const { error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', validId);
  
  if (error) {
    console.error('Error updating post:', error);
    return false;
  }
  
  return true;
}

export async function deletePost(id: string): Promise<boolean> {
  const validId = ensureValidUuid(id);
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', validId);
  
  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }
  
  return true;
}

// Helper function to ensure we have a valid UUID
function ensureValidUuid(id: string): string {
  if (isValidUuid(id)) {
    return id;
  }
  
  // For numeric IDs from local data, generate a consistent UUID
  // Fix for the Uint8Array type issue - create a proper array for the UUID seed
  const seed = new Uint8Array(16);
  const idStr = id.toString().padEnd(16, '0');
  for (let i = 0; i < 16; i++) {
    seed[i] = idStr.charCodeAt(Math.min(i, idStr.length - 1));
  }
  
  return uuidv4({ random: seed });
}

// Simple UUID validation
function isValidUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
