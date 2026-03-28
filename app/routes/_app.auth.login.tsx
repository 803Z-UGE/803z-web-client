import { Button } from '@/components/atoms/button';
import { Checkbox, CheckboxField } from '@/components/atoms/checkbox';
import { Field, Label } from '@/components/atoms/fieldset';
import { Heading } from '@/components/atoms/heading';
import { Input } from '@/components/atoms/input';
import { Strong, Text, TextLink } from '@/components/atoms/text';
import { Form } from 'react-router';
import type { Route } from '../+types/root';
import { useAuth } from '@/contexts/auth';

// export async function clientAction({ request }: Route.ClientActionArgs) {
//     let formData = await request.formData();
//     const email = formData.get('email') as string;
//     const password = formData.get('password') as string;
//     console.log('Login attempt with email:', email);
//     const { login } = useAuth();
//     login(email, password);
// }

export default function Login() {
    const { login } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            await login(email, password);
            console.log('Login successful');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <Form
            method="post"
            className="grid w-full max-w-sm grid-cols-1 gap-8"
            onSubmit={handleSubmit}
        >
            <img src="/logo.svg" className="h-8 dark:invert-100" />
            <Heading>Coucou</Heading>
            <Field>
                <Label>Email</Label>
                <Input type="email" name="email" placeholder="bob@edu.univ-eiffel.fr" />
            </Field>
            <Field>
                <Label>Mot de passe</Label>
                <Input type="password" name="password" placeholder="••••••••" />
            </Field>
            <div className="flex items-center justify-between">
                <CheckboxField>
                    <Checkbox name="remember" />
                    <Label>Se souvenir de moi</Label>
                </CheckboxField>
                <Text>
                    <TextLink href="/auth/forgot-password">
                        <Strong>Mot de passe oublié ?</Strong>
                    </TextLink>
                </Text>
            </div>
            <Button type="submit" className="w-full">
                Connexion
            </Button>
            <Text>
                Pas encore de compte ?{' '}
                <TextLink href="/auth/register">
                    <Strong>Créer un compte</Strong>
                </TextLink>
            </Text>
        </Form>
    );
}
