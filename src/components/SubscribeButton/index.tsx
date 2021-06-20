import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

//Locais que podemos realizar acoes secretas
//dentro do getServerSideProps
//dentro do getStaticProps
//e dentro api Routes <-

export const SubscribeButton = () => {
  const [session] = useSession();
  const router = useRouter()

  const handleSubscribe = async () => {
    //Verificar se o visitante esta logado
    if (!session) {
      signIn("github");
      return;
    }

    if(session.activeSubscription){
      router.push('/posts')
      return
    }

    // Finalizar o pedido
    try {
      const response = await api.post("/subscribe");
      
      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};
