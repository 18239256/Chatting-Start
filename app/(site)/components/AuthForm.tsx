'use client';

import axios from "axios";
import Button from "../../components/Button";
import Input from '../../components/inputs/Input';
import AuthSocialButton from "./AuthSocialButton";
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState} from "react";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import {BsGithub, BsGoogle} from 'react-icons/bs';

import { toast } from "react-hot-toast";

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () =>{
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (session?.status === 'authenticated') {
        router.push('/users')
      }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
          setVariant('REGISTER');
        } else {
          setVariant('LOGIN');
        }
    }, [variant]);
    
    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
      setIsLoading(true);
    
      if (variant === 'REGISTER') {
        axios.post('/api/register', data)
        .then(() => signIn('credentials', {
          ...data,
          redirect: false,
        }))
        .then((callback) => {
          if (callback?.error) {
            toast.error('注册信息错误');
          }
  
          if (callback?.ok) {
            toast.success('注册成功');
            // router.push('/conversations')
          }
        })
        .catch(() => toast.error('出错了!'))
        .finally(() => setIsLoading(false));
      }
  
      if (variant === 'LOGIN') {
        signIn('credentials', {
          ...data,
          redirect: false
        })
        .then((callback) => {
          if (callback?.error) {
            toast.error('登录信息错误');
          }
  
          if (callback?.ok) {
            toast.success('登录成功');
            // router.push('/conversations')
          }
        })
        .finally(() => setIsLoading(false))
      }
    };

    const socialAction = (action: string) => {
      setIsLoading(true);
  
      signIn(action, { redirect: false })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials!');
          }
  
          if (callback?.ok) {
            toast.success('登录成功');
            // router.push('/conversations')
          }
        })
        .finally(() => setIsLoading(false));
    };

    return(
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div 
          className="
          bg-white
            px-4
            py-8
            shadow
            sm:rounded-lg
            sm:px-10
          "
        >
          <form 
            className="space-y-6" 
            onSubmit={handleSubmit(onSubmit)}
          >
            {variant === 'REGISTER' && (
              <Input
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                id="name" 
                label="用户名"
              />
            )}
            <Input 
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="email" 
              label="Email 地址" 
              type="email"
            />
            <Input 
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="password" 
              label="密码" 
              type="password"
            />
            <div>
              <Button disabled={isLoading} fullWidth type="submit">
                {variant === 'LOGIN' ? '登录' : '注册'}
              </Button>
            </div>
          </form>
  
          <div className="mt-6">
            <div className="relative">
              <div 
                className="
                  absolute 
                  inset-0 
                  flex 
                  items-center
                "
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  或者 采用其它登录方式
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">

            <AuthSocialButton 
              icon={BsGithub} 
              onClick={() => socialAction('github')} 
            />
            <AuthSocialButton 
              icon={BsGoogle} 
              onClick={() => socialAction('google')} 
            />

          </div>
          </div>
          <div 
            className="
              flex 
              gap-2 
              justify-center 
              text-sm 
              mt-6 
              px-2 
              text-gray-500
            "
          >
            <div>
              {variant === 'LOGIN' ? '新用户?' : '已经拥有了账户?'} 
            </div>
            <div 
              onClick={toggleVariant} 
              className="underline cursor-pointer"
            >
              {variant === 'LOGIN' ? '创建一个新账号' : '登录'}
            </div>
          </div>
        </div>
      </div>
    );
}

export default AuthForm;