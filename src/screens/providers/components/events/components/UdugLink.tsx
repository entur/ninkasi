import type { MouseEvent, ReactNode } from 'react';
import { useConfig } from '@/contexts/ConfigContext';

interface Props {
  id: string;
  referential: string;
  navigate: (url: string) => void;
  children: ReactNode;
}

const UdugLink = ({ id, referential, navigate, children }: Props) => {
  const { udugBaseUrl } = useConfig();
  const baseURL = `${udugBaseUrl ?? '/netex-validation-reports/'}report/`;
  const URL = `${baseURL}${referential}/${id}`;

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(URL);
  };

  return (
    <a title={URL} href={URL} onClick={onClick}>
      {children}
    </a>
  );
};

export default UdugLink;
