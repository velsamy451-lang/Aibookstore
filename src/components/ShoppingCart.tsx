import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Cart ({getTotalItems()})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.book.id}
                  className="flex gap-4 bg-gray-50 p-4 rounded-lg"
                >
                  <div className="w-20 h-28 bg-gray-200 rounded flex-shrink-0">
                    {item.book.image_url ? (
                      <img
                        src={item.book.image_url}
                        alt={item.book.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {item.book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.book.author}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.book.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.book.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${(item.book.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.book.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
                <span>Total</span>
                <span className="text-blue-600">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
