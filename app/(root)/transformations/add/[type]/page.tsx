import Header from '@/components/shared/Header'
import React from 'react'
import { transformationTypes } from '@/constants'
import TransformationForm from '@/components/shared/TransformationForm';
import { auth } from '@clerk/nextjs/server';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const AddTransformationPage= async({ params : {type}}:SearchParamProps) => {
  const transformation = transformationTypes[type];
  const { userId } =await auth();
if(!userId){
  redirect('/sign-in')
}
  let user;
  try {
    user = await getUserById(userId);
  } catch (error) {
    redirect('/sign-in');
  }
  return (
    <>
        <Header 
    title={transformation.title}
    subtitle={transformation.subTitle}></Header>

    <section>
    <TransformationForm
    action="Add"
    userId={user._id}
    type={transformation.type as TransformationTypeKey}
    creditBalance={user.creditBalance}></TransformationForm>
    </section>

    </>

  )
}

export default AddTransformationPage