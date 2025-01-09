"use client";
import { useStore } from '@/store/globalStore';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import {useEffect} from "react";

export default function Home() {
    const router = useRouter(); // Хук для перенаправления

    const { isAdmin, setAdmin } = useStore((state) => ({
        isAdmin: state.isAdmin,
        setAdmin: state.setAdmin,
     }));

    useEffect(() => {
        if (isAdmin !== null) {
            router.push(isAdmin ? '/admin' : '/employee');
        }
    }, [isAdmin, router]);

  return (
      <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: '16px',
          }}
      >

        {isAdmin === null && (
            <>
              <Button
                  type="primary"
                  onClick={() => setAdmin(true)} // Устанавливаем роль "Админ"
                  style={{
                    width: '200px',
                  }}
              >
                Я админ
              </Button>
              <Button
                  onClick={() => setAdmin(false)} // Устанавливаем роль "Пользователь"
                  style={{
                    width: '200px',
                  }}
              >
                Я пользователь
              </Button>
            </>
        )}

        {isAdmin !== null && (
            <div>
              <p>Вы {isAdmin ? "админ" : "пользователь"}.</p>
            </div>
        )}
      </div>
  );
}