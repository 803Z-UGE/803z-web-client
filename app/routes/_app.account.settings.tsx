import { Heading, Subheading } from '@/components/atoms/heading';
import { Divider } from '@/components/atoms/divider';
import { Text } from '@/components/atoms/text';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import { Checkbox, CheckboxField } from '@/components/atoms/checkbox';
import { Label } from '@/components/atoms/fieldset';
import ThemeSwitcher from '@/components/theme-switcher';

export default function Settings({ children }: { children: React.ReactNode }) {
    return (
        <form method="post" className="mx-auto max-w-4xl">
            <Heading>Paramètres</Heading>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>Infos personnelles</Subheading>
                    <Text>Ces informations nous serviront à te contacter.</Text>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                    <Input
                        aria-label="First Name"
                        name="first-name"
                        defaultValue="Killian"
                        placeholder="Prénom"
                    />
                    <Input
                        aria-label="Last Name"
                        name="last-name"
                        defaultValue="Guilland"
                        placeholder="Nom"
                    />
                    <Input
                        type="email"
                        aria-label="Email"
                        name="email"
                        defaultValue="killian.guilland@edu.univ-eiffel.fr"
                        disabled
                        className="sm:col-span-2"
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>Préférences</Subheading>
                    <Text>Customise le look du site !</Text>
                </div>
                <div>
                    <ThemeSwitcher />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>Adhésion</Subheading>
                    <Text>Tu dois être adhérent pour emprunter du matériel</Text>
                </div>
                <div className="space-y-4">
                    <CheckboxField>
                        <Checkbox name="email_is_public" defaultChecked />
                        <Label>Je suis adhérent 803Z</Label>
                    </CheckboxField>
                </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
                <Button type="reset" plain>
                    Reset
                </Button>
                <Button type="submit">Save changes</Button>
            </div>
        </form>
    );
}
