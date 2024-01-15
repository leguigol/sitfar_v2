import React, { useContext, useState } from 'react'
import { UserContext } from '../context/userProvider';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { erroresFirebase } from '../utils/erroresFirebase';
import FormError from '../components/FormError';
import { formValidate } from '../utils/formValidate';
import FormInput from '../components/FormInput';

const Register = () => {

    // const [email,setEmail]=useState('leguigol@gmail.com');
    // const [password,setPassword]=useState('lancelot')

    const navigate=useNavigate();
    const {registerUser}=useContext(UserContext);

    const {register,handleSubmit,formState: {errors},getValues,setError}=useForm();

    const {required,patternEmail,minLength,validateTrim,validateEquals}=formValidate();

    const onSubmit=async({email,password})=> {
        
        try{
            await registerUser(email,password);
            console.log('Usuario Creado');
            navigate("/");
        }catch(error){
            console.log(error.code);
            setError("firebase",{
                message: erroresFirebase(error.code),
            })
        }
    }

    return (
    <>
        <h1>Register</h1> 
        <FormError error={errors.firebase}/>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput 
                type="email" placeholder='Ingrese Email' {...register("email",{required,pattern: patternEmail,})}            
            >
                <FormError error={errors.email} />
            </FormInput>
            {/* <input type="email" placeholder='Ingrese Email' {...register("email",{required,pattern: patternEmail,})}/> */}
            <FormInput
                type="password"
                placeholder='Ingrese password'
                {...register("password",
                {minLength,
                 validate: validateTrim,
                })}                 
            >
            </FormInput>
            {/* <input type="password" placeholder='Ingrese password' {...register("password",
                {minLength,
                 validate: validateTrim,
                })} /> */}
            <FormError error={errors.password} />
            <input type="password" placeholder='Ingrese password' 
                {...register("repassword", 
                { validate: validateEquals(getValues),
                })} 
            />
            <FormError error={errors.repassword} />
            <button type="submit">Register</button>
        </form>
    </>
  )
}

export default Register
