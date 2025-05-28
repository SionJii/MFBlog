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
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './config';
import type { Post } from '../types/post';
import { getUserProfile } from './users';

// 게시물 생성
export const createPost = async (post: Omit<Post, 'id' | 'author' | 'authorId'>) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const userProfile = await getUserProfile(user);
    if (!userProfile) {
      throw new Error('닉네임을 먼저 설정해주세요.');
    }

    const docRef = await addDoc(collection(db, 'posts'), {
      ...post,
      author: userProfile.nickname,
      authorId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // 문서 생성 후 바로 조회하여 실제 데이터 반환
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      } as Post;
    }
    throw new Error('게시물 생성 실패');
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// 게시물 수정
export const updatePost = async (id: string, post: Partial<Post>) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const postRef = doc(db, 'posts', id);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }

    const postData = postSnap.data();
    if (postData.authorId !== user.uid) {
      throw new Error('게시물을 수정할 권한이 없습니다.');
    }

    await updateDoc(postRef, {
      ...post,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// 게시물 삭제
export const deletePost = async (id: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const postRef = doc(db, 'posts', id);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }

    const postData = postSnap.data();
    if (postData.authorId !== user.uid) {
      throw new Error('게시물을 삭제할 권한이 없습니다.');
    }

    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// 단일 게시물 조회
export const getPost = async (id: string) => {
  try {
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        content: data.content,
        category: data.category,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        excerpt: data.excerpt,
        author: data.author,
        authorId: data.authorId,
        imageUrl: data.imageUrl,
      } as Post;
    }
    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
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

// 이미지 업로드
export const uploadImage = async (file: File) => {
  try {
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}; 