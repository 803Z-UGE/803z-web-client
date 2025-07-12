import { AuthLayout } from '@/components/atoms/auth-layout';
import { Button } from '@/components/atoms/button';
import { Checkbox, CheckboxField } from '@/components/atoms/checkbox';
import { Field, Label } from '@/components/atoms/fieldset';
import { Heading } from '@/components/atoms/heading';
import { Input } from '@/components/atoms/input';
import { Strong, Text, TextLink } from '@/components/atoms/text';

export default function Register() {
    return (
        <form action="#" method="POST" className="grid w-full max-w-sm grid-cols-1 gap-8">
            <img src="/logo.svg" className="h-8 dark:invert-100" />
            <Heading>Inscris-toi</Heading>
            <Field>
                <Label>Email</Label>
                <Input type="email" name="email" placeholder="bob@edu.univ-eiffel.fr" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-6">
                <Field>
                    <Label>Prénom</Label>
                    <Input name="firstName" placeholder="Bob" />
                </Field>
                <Field>
                    <Label>Nom</Label>
                    <Input name="lastName" placeholder="Smith" />
                </Field>
            </div>
            <Field>
                <Label>Mot de passe</Label>
                <Input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                />
            </Field>
            <CheckboxField>
                <Checkbox name="remember" />
                <Label>Je suis adhérent 803z.</Label>
            </CheckboxField>
            <Button type="submit" className="w-full">
                Créer un compte
            </Button>
            <Text>
                Déjà un compte ?{' '}
                <TextLink href="/auth/login">
                    <Strong>Se connecter</Strong>
                </TextLink>
            </Text>
        </form>
    );
}
