import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart'); // vai buscar no localstorage os dados

    if (storagedCart) {
      return JSON.parse(storagedCart); //usando o JSON.parse para transformar em array
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart];// novo array com os valores de cart
      const productExists = updatedCart.find(product => product.id === productId); // verificando se o id do produto é o mesmo que o no estoque
    
      const stock = await api.get(`/stock/${productId}`); // verifica no estoque

      const stockAmount = stock.data.amount; // pega o valor do estoque 
      const currentAmount = productExists ? productExists.amount :0; //pega o valor atual e verifica se existe e seta como 0
      const amount = currentAmount + 1;

      if(amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return; // se o valor pedido for maior que o valor de estoque, apresenta a msg 
      }

      if(productExists) {
        productExists.amount = amount; // atualiza o valor
      } else {
        const product = await api.get(`/products/${productId}`);

        const newProduct = {
          ...product.data,
          amount: 1
        }
        updatedCart.push(newProduct); //acrescenta 1 se for um produto novo
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart)); // tranformando em strinf
      }

      setCart(updatedCart);
    } catch {
      toast.error('Erro na adição do produto');// mensagem de erro caso não seja possível add um novo produto
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
