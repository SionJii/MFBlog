import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './config';
import type { User } from 'firebase/auth';
import type { UserProfile } from '../types/user';

const usersCollection = 'users';

// 사용자 프로필 가져오기
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, usersCollection, uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }

    const data = userSnap.data();
    return {
      uid: userSnap.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : undefined
    } as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('사용자 정보를 불러오는데 실패했습니다.');
  }
};

// 사용자 프로필 설정
export const setUserProfile = async (user: User, nickname: string): Promise<UserProfile> => {
  try {
    const userProfile: UserProfile = {
      uid: user.uid,
      nickname,
      email: user.email || '',
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
    });
    return userProfile;
  } catch (error) {
    console.error('Error setting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, usersCollection, uid);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('사용자 정보 업데이트에 실패했습니다.');
  }
}; 