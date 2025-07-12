import { AuthLayout } from '@/components/atoms/auth-layout';
import { Button } from '@/components/atoms/button';
import { Field, Label } from '@/components/atoms/fieldset';
import { Heading } from '@/components/atoms/heading';
import { Input } from '@/components/atoms/input';
import { Strong, Text, TextLink } from '@/components/atoms/text';

export default function ForgotPassword() {
    return (
        <form action="" method="POST" className="grid w-full max-w-sm grid-cols-1 gap-8">
            <img src="/logo.svg" className="h-8 dark:invert-100" />
            <Heading>Réinitialiser le mot de passe</Heading>
            <Text>
                Entre ton email et nous t'enverrons un lien pour réinitialiser ton mot de passe.
            </Text>
            <Field>
                <Label>Email</Label>
                <Input type="email" name="email" />
            </Field>
            <Button type="submit" className="w-full">
                Réinitialiser le mot de passe
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
