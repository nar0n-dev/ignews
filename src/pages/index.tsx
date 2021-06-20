import { GetStaticProps } from 'next'
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

//3 formas de chamada API = Buscar dados
  //1. Client-Side
  //2. Server-Side
  //3. Static Site Generation

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}
//Server Side Rendering (SSR)
  //Buscamos os dados do produdo, no caso o preco, que criamos no stripe e mostramos ele na home
  //OBS.: Sempre devemos comecar pelo pages e depois passar as props para os components
  //export const getServerSideProps:

//Server Static Generation (SSG) 
  //Alem da propridades que tinhamos (notFound, Redirect), temos agora revalidate, que falara quando essa pagina tem que ser atualizada
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1ItLQICFMuHYArs890OiQ0Ib') 

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100)
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}