import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from './config';
import type { Post, CreatePostData, UpdatePostData } from '../types/post';
import { getUserProfile } from './users';

const postsCollection = collection(db, 'posts');

// 게시물 목록 가져오기
export const getPosts = async (): Promise<Post[]> => {
  try {
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: doc.data().updatedAt ? (doc.data().updatedAt as Timestamp).toDate() : undefined
    })) as Post[];
  } catch (error) {
    console.error('Error getting posts:', error);
    throw new Error('게시물을 불러오는데 실패했습니다.');
  }
};

// 특정 게시물 가져오기
export const getPost = async (id: string): Promise<Post> => {
  try {
    const docRef = doc(postsCollection, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : undefined
    } as Post;
  } catch (error) {
    console.error('Error getting post:', error);
    throw new Error('게시물을 불러오는데 실패했습니다.');
  }
};

// 게시물 생성
export const createPost = async (postData: CreatePostData): Promise<Post> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const userProfile = await getUserProfile(user.uid);
    if (!userProfile?.nickname) {
      throw new Error('닉네임을 먼저 설정해주세요.');
    }

    const newPost = {
      ...postData,
      author: userProfile.nickname,
      authorId: user.uid,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(postsCollection, newPost);
    const docSnap = await getDoc(docRef);
    
    return {
      id: docRef.id,
      ...docSnap.data(),
      createdAt: (docSnap.data()?.createdAt as Timestamp).toDate(),
    } as Post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// 게시물 수정
export const updatePost = async (id: string, postData: UpdatePostData): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const post = await getPost(id);
    if (post.authorId !== user.uid) {
      throw new Error('게시물을 수정할 권한이 없습니다.');
    }

    const updateData = {
      ...postData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(doc(postsCollection, id), updateData);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// 게시물 삭제
export const deletePost = async (id: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const post = await getPost(id);
    if (post.authorId !== user.uid) {
      throw new Error('게시물을 삭제할 권한이 없습니다.');
    }

    // 이미지가 있다면 스토리지에서도 삭제
    if (post.imageUrl) {
      const imageRef = ref(storage, post.imageUrl);
      await deleteObject(imageRef);
    }

    await deleteDoc(doc(postsCollection, id));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// 이미지 업로드
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const timestamp = Date.now();
    const fileName = `${user.uid}_${timestamp}_${file.name}`;
    const storageRef = ref(storage, `posts/${fileName}`);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
};

// 모든 게시물 가져오기
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        category: data.category,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        excerpt: data.excerpt,
        author: data.author,
        authorId: data.authorId,
        imageUrl: data.imageUrl,
      } as Post;
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

// 카테고리별 게시물 가져오기
export const getPostsByCategory = async (category: string): Promise<Post[]> => {
  try {
    const postsRef = collection(db, 'posts');
    let q;
    
    if (category && category !== '') {
      q = query(
        postsRef,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        postsRef,
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        category: data.category,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        excerpt: data.excerpt,
        author: data.author,
        authorId: data.authorId,
        imageUrl: data.imageUrl,
      } as Post;
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting posts by category:', error);
    throw error;
  }
}; 