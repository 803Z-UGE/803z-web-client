import { AuthLayout } from '@/components/atoms/auth-layout';
import { Button } from '@/components/atoms/button';
import { Checkbox, CheckboxField } from '@/components/atoms/checkbox';
import { Field, Label } from '@/components/atoms/fieldset';
import { Heading } from '@/components/atoms/heading';
import { Input } from '@/components/atoms/input';
import { Strong, Text, TextLink } from '@/components/atoms/text';

export default function Login() {
    return (
        <form action="#" method="POST" className="grid w-full max-w-sm grid-cols-1 gap-8">
            <img src="/logo.svg" className="h-8 dark:invert-100" />
            <Heading>Connecte-toi à ton compte</Heading>
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
        </form>
    );
}
