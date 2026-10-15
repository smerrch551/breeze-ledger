import type { LucideIcon, LucideProps } from 'lucide-react-native';

/**
 * Icon aliases for the project's single icon library.
 *
 * These forward lucide's own types rather than re-declaring the prop shape: a
 * hand-written structural alias does not match `ForwardRefExoticComponent`'s
 * propTypes and makes every icon fail to type-check.
 */
export type IconProps = LucideProps;
export type IconComponent = LucideIcon;
