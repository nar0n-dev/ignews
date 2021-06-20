import { render, screen} from '@testing-library/react'
import { getPrismicClient } from '../../services/prismic'
import { mocked } from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getSession } from 'next-auth/client'

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

const post = {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post excerpt</p>',
    updatedAt: '01 de abril de 2021'
};


describe('Post page', () => {
    test('Test A - should render', () => {
        render(<Post post={post}/>)

        expect(screen.getByText('My new post')).toBeInTheDocument();
        expect(screen.getByText('Post excerpt')).toBeInTheDocument();
    })

    test('Test B - redirects user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post',
            },
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            })
        )
    })
    
    test('Test C - load initial data', async () => {
        const getSessionMocked = mocked(getSession)

        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My new post' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post excerpt' }
                    ],
                },
                last_publication_date: '04-01-2021'
            })
        } as any)
        
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post',
            },
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props:{
                    post: {
                        slug: 'my-new-post',
                        title: 'My new post',
                        content: '<p>Post excerpt</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )
    })
    
})