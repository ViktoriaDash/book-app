import React from 'react';
import { render } from '@testing-library/react';

import EbooksPage from '@/app/(inner)/ebooks/page';
import AuthorsPage from '@/app/(inner)/authors/page';
import ProfilePage from '@/app/profile/page';
import ArticlesPage from '@/app/(inner)/articles/page';
import LoginPage from '@/app/login/page';
import RegisterPage from '@/app/register/page';

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { name: 'Віка' } }, status: 'authenticated' }),
}));

jest.mock('swr', () => ({
  __esModule: true,
  default: () => ({ data: [], error: null, isLoading: false }),
  useSWRConfig: () => ({ mutate: jest.fn() }),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Final Coverage', () => {
  test('render ebooks', () => { render(<EbooksPage />); });
  test('render authors', () => { render(<AuthorsPage />); });
  test('render profile', () => { render(<ProfilePage />); });
  test('render articles', () => { render(<ArticlesPage />); });
  test('render login', () => { render(<LoginPage />); });
  test('render register', () => { render(<RegisterPage />); });
});