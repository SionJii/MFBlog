import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';
import type { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  nickname: string;
  email: string;
}

// 사용자 프로필 가져오기
export const getUserProfile = async (user: User): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// 사용자 프로필 설정
export const setUserProfile = async (user: User, nickname: string): Promise<UserProfile> => {
  try {
    const userProfile: UserProfile = {
      uid: user.uid,
      nickname,
      email: user.email || '',
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error setting user profile:', error);
    throw error;
  }
}; 