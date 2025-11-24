import { View, Text, Pressable, Button } from 'react-native'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addUserRequest, selectUser } from '../../../features/auth';


const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
      <Text>hello</Text>
      <Text>{JSON.stringify(user)}</Text>
      <Pressable onPress={()=>dispatch(addUserRequest('ADD_USER'))}>
       <Text>Button</Text>
      </Pressable>
    </View>
  )
}

export default LoginScreen