import { Slot } from 'expo-router';
import { AuthContextProvider } from '~/contexts/Auth';

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Slot />
    </AuthContextProvider>
  );
}
