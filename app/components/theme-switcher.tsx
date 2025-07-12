import { DropdownItem, DropdownLabel } from '@/components/atoms/dropdown';
import { MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import { useTheme } from '@/contexts/theme';
import { Listbox, ListboxLabel, ListboxOption } from '@/components/atoms/listbox';

export default function NavbarLayout() {
    const { theme, setTheme } = useTheme();

    return (
        <Listbox
            aria-label="Region"
            name="region"
            placeholder="Region"
            defaultValue="Ontario"
            onChange={value => setTheme(value)}
        >
            <ListboxOption key={'default'} value={'default'}>
                <ListboxLabel>{"Préférences de l'appareil"}</ListboxLabel>
            </ListboxOption>
            <ListboxOption key={'light'} value={'light'}>
                <ListboxLabel>{'Thème clair'}</ListboxLabel>
            </ListboxOption>
            <ListboxOption key={'dark'} value={'dark'}>
                <ListboxLabel>{'Thème sombre'}</ListboxLabel>
            </ListboxOption>
        </Listbox>
    );
}
