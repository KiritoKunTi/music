import { defineStore } from 'pinia'
import { setDoc, doc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '@/includes/firebase'

export default defineStore('user', {
    state: () => ({
        userLoggedIn: false,
        userInfo: null,
        error: ''
    }),
    actions: {
        async register(values) {
            await createUserWithEmailAndPassword(auth, values.email, values.password).then(
                (res) => {
                    this.userInfo = res.user
                }
            )
            await updateProfile(this.userInfo, {
                displayName: values.name,
            })
            await setDoc(doc(db, 'users', this.userInfo.uid), {
                name: values.name,
                email: values.email,
                age: values.age,
                country: values.country
            })
            this. userLoggedIn = true
        },
        async authenticate(values) {
            await signInWithEmailAndPassword(auth, values.email, values.password).then(
                (res) => {
                    this.userInfo = res.user;
                }
            );
        
            this.userLoggedIn = true;
        },
        async signOut() {
            await signOut(auth);
            this.userLoggedIn = false;
        }
    }
})
