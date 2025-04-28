'use client';
import IconSave from '@/components/icon/icon-save';
import IconX from '@/components/icon/icon-x';
import React, { useState } from 'react';
import IconXCircle from '../icon/icon-x-circle';

const CommponentBillForm = ({ setUserRole }) => {
    const currencyList = ['USD - US Dollar', 'GBP - British Pound', 'IDR - Indonesian Rupiah', 'INR - Indian Rupee', 'BRL - Brazilian Real', 'EUR - Germany (Euro)', 'TRY - Turkish Lira'];

    const [items, setItems] = useState<any>([
        {
            id: 1,
            title: '',
            description: '',
            rate: 0,
            quantity: 0,
            amount: 0,
        },
    ]);

    const addItem = () => {
        let maxId = 0;
        maxId = items?.length ? items.reduce((max: number, character: any) => (character.id > max ? character.id : max), items[0].id) : 0;

        setItems([
            ...items,
            {
                id: maxId + 1,
                title: '',
                description: '',
                rate: 0,
                quantity: 0,
                amount: 0,
            },
        ]);
    };

    const removeItem = (item: any = null) => {
        setItems(items.filter((d: any) => d.id !== item.id));
    };

    const changeQuantityPrice = (type: string, value: string, id: number) => {
        const list = items;
        const item = list.find((d: any) => d.id === id);
        if (type === 'quantity') {
            item.quantity = Number(value);
        }
        if (type === 'price') {
            item.amount = Number(value);
        }
        setItems([...list]);
    };

    return (
        <div className="flex flex-col gap-2.5 xl:flex-row">
            <div className="panel flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                <div className="flex flex-wrap justify-between px-4">
                    <div className="grid flex-1 grid-cols-2 gap-5 sm:grid-cols-2 p-4  dark:border-[#191e3a] dark:bg-black">
                        {/* Customer Input */}
                        <div className="form-group flex items-center">
                            <label htmlFor="Supplier" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Supplier
                            </label>
                            <select
                                id="Supplier"
                                name="Supplier"
                                className="form-select flex-1"
                            >
                                <option value="">Choose supplier</option>
                                <option value="John Doe">John Doe</option>
                                <option value="Jane Smith">Jane Smith</option>
                                <option value="Acme Corp">Acme Corp</option>
                                <option value="Global Enterprises">Global Enterprises</option>
                            </select>
                        </div>

                        {/* Vehicle Input */}
                        <div className="form-group flex items-center">
                            <label htmlFor="vehicle" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Vehicle
                            </label>
                            <select
                                id="vehicle"
                                name="vehicle"
                                className="form-select flex-1"
                            >
                                <option value="">Choose Vehicle</option>
                                <option value="Car">Car</option>
                                <option value="Truck">Truck</option>
                                <option value="Van">Van</option>
                                <option value="Motorcycle">Motorcycle</option>
                            </select>
                        </div>
                        <div className="form-group flex items-center">
                            <label htmlFor="employee" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Employee
                            </label>
                            <select
                                id="employee"
                                name="employee"
                                className="form-select flex-1"
                            >
                                <option value="">Choose Employee</option>
                                <option value="Emily Johnson">Emily Johnson</option>
                                <option value="Michael Brown">Michael Brown</option>
                                <option value="Chris Davis">Chris Davis</option>
                                <option value="Sarah Wilson">Sarah Wilson</option>
                            </select>
                        </div>



                    </div>
                </div>

                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                <div className="mt-8">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Details		</th>
                                    <th>Category	</th>
                                    <th className="w-1">Quantity</th>
                                    <th className="w-1">Price</th>
                                    <th>Discount</th>
                                    <th>Total</th>
                                    <th className="w-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length <= 0 && (
                                    <tr>
                                        <td colSpan={5} className="!text-center font-semibold">
                                            No Item Available
                                        </td>
                                    </tr>
                                )}
                                {items.map((item: any) => {
                                    return (
                                        <tr className="align-top" key={item.id}>
                                            <td>
                                                <select className="form-select min-w-[200px]" >
                                                    <option>Please select</option>
                                                    <option>Abu dhabi toll</option>
                                                    <option>Abu dhabi toll:service charge</option>
                                                    <option>collection</option>
                                                    <option>Damages</option>
                                                    <option>Delivery</option>
                                                    <option>Excess Killometers</option>
                                                    <option>Extra hours</option>
                                                    <option>Fuel Charge</option>
                                                    <option>Salik fees</option>
                                                    <option>Salik Parking</option>
                                                    <option>Traffic fines</option>
                                                </select>
                                                <textarea className="form-textarea mt-4" placeholder="Enter Description" defaultValue={item.description}></textarea>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-input w-32"
                                                    placeholder="Reference"
                                                    defaultValue={item.quantity}
                                                    min={0}
                                                    onChange={(e) => changeQuantityPrice('quantity', e.target.value, item.id)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-input w-32"
                                                    placeholder="Quantity"
                                                    defaultValue={item.quantity}
                                                    min={0}
                                                    onChange={(e) => changeQuantityPrice('quantity', e.target.value, item.id)}
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-input w-32"
                                                    placeholder="Rate"
                                                    defaultValue={item.amount}
                                                    min={0}
                                                    onChange={(e) => changeQuantityPrice('price', e.target.value, item.id)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-input w-32"
                                                    placeholder="Discount"
                                                    defaultValue={item.amount}
                                                    min={0}
                                                    onChange={(e) => changeQuantityPrice('price', e.target.value, item.id)}
                                                />
                                            </td>

                                            <td>${item.quantity * item.amount}</td>
                                            <td>
                                                <button type="button" onClick={() => removeItem(item)}>
                                                    <IconX className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex flex-col justify-between px-4 sm:flex-row">
                        <div className="mb-6 sm:mb-0">
                            <button type="button" className="btn btn-primary" onClick={() => addItem()}>
                                Add Item
                            </button>
                        </div>
                        <div className="sm:w-2/5">
                            <div className="flex items-center justify-between">
                                <div>Subtotal</div>
                                <div>$0.00</div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div>Tax(%)</div>
                                <div>0%</div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div>Shipping Rate($)</div>
                                <div>$0.00</div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div>Discount(%)</div>
                                <div>0%</div>
                            </div>
                            <div className="mt-4 flex items-center justify-between font-semibold">
                                <div>Total</div>
                                <div>$0.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 w-full xl:mt-0 xl:w-96">
                <div className="panel mb-5">
                    <div className="mt-4 form-group flex items-center">
                        <label htmlFor="reciever-email" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                            Bill Reference*
                        </label>
                        <input id="reciever-email" type="date" name="reciever-email" className="form-input flex-1" />
                    </div>
                    <div className="mt-4 form-group flex items-center">
                        <label htmlFor="reciever-email" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                            Date
                        </label>
                        <input id="reciever-email" type="date" name="reciever-email" className="form-input flex-1" />
                    </div>
                    <div className="mt-4 form-group flex items-center">
                        <label htmlFor="reciever-address" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                            Due Date

                        </label>
                        <input id="reciever-address" type="date" name="reciever-address" className="form-input flex-1" />
                    </div>
                    <div className="mt-4 form-group flex items-center">
                        <label htmlFor="reciever-number" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                            Attach File(s)

                        </label>
                        <input id="reciever-number" type="file" name="reciever-number" className="form-input flex-1" />
                    </div>
                    <div className="mt-4 form-group flex items-center">
                        <label htmlFor="reciever-number" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                            #[nRef]

                        </label>
                        <input id="reciever-number" type="text" name="reciever-number" className="form-input flex-1" />
                    </div>
                </div>
                <div className="panel">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                        <button type="button" className="btn btn-success w-full gap-2">
                            <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                            Save
                        </button>

                        <button type="button" className="btn btn-danger w-full gap-2" onClick={() => { setUserRole(false) }}>
                            <IconXCircle className="shrink-0 ltr:mr-2 rtl:ml-2" />
                            Close
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommponentBillForm;
