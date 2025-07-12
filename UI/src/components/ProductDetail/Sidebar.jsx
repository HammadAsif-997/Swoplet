const Sidebar = ({productName, tag1, tag2, tag3, price}) => (
    <div className="bg-gray-50 rounded-lg p-6 shadow space-y-4">
                  <h1 className="text-xl font-bold">{productName}</h1>
                  <div className="flex gap-2 text-xs flex-wrap">
                      <span className="bg-blue-200 px-2 py-1 rounded-full">{tag1}</span>
                      <span className="bg-blue-200 px-2 py-1 rounded-full">{tag2}</span>
                      <span className="bg-blue-200 px-2 py-1 rounded-full">{tag3}</span>
                  </div>
                  <p className="text-lg font-semibold text-green-700">£{price}</p>

                  <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      Contact Seller
                  </button>
                  <button className="w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50">
                      Add to Wishlist
                  </button>

                  <div className="bg-yellow-100 p-4 rounded text-sm">
                      <p className="font-medium mb-2">
                          Want to know avg. market price of this product?
                      </p>
                      <button className="bg-yellow-400 text-white px-4 py-1 rounded shadow">
                          Predict Price
                      </button>
                      <p className="mt-2 text-gray-700">£4.50 – £7.50</p>
                  </div>
              </div>

)

export default Sidebar;