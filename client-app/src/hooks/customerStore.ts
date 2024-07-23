import { toast } from 'react-toastify';
import agent from '../app/api/agent';
import { create } from 'zustand';
import { Customer } from '../app/types/customer';

type State = {
	loading: boolean;
	initialLoading: boolean;
	customers: Customer[];
};

type Actions = {
	addCustomer: (customer: Customer) => Promise<void>;
	loadCustomers: () => Promise<void>;
	editCustomer: (customer: Customer) => Promise<void>;
	deleteCustomer: (id: string) => Promise<void>;
};

const useCustomerStore = create<State & Actions>((set, get) => ({
	loading: false,
	initialLoading: false,
	customers: [],
	addCustomer: async (customer) => {
		set({ loading: true });
		try {
			await agent.Customers.add(customer);
			//adding new customer to customers is not neccessary because these 2 fuctions are in different page
			// const newCustomers = get().customers;
			// newCustomers.unshift(customer);
			// set({ customers: newCustomers });
			toast.info('Thanks you for registering!');
		} catch (error) {
			console.log(error);
		}
		set({ loading: false });
	},
	loadCustomers: async () => {
		set({ initialLoading: true });
		try {
			const customers = await agent.Customers.get();
			if (customers.length > get().customers.length) {
				set({
					customers: customers,
				});
			}
		} catch (error) {
			console.log(error);
		} finally {
			set({ initialLoading: false });
		}
	},
	editCustomer: async (customer) => {
		set({ loading: true });
		try {
			const responseCustomer = await agent.Customers.edit(customer);
			const editedCustomers = get().customers;
			editedCustomers[
				editedCustomers.indexOf(editedCustomers.find((c) => c.id === customer.id)!)
			] = responseCustomer;
			set({ customers: editedCustomers });
			console.log(get().customers);
			toast.info('Edited');
		} catch (error) {
			console.log(error);
		}
		set({ loading: false });
	},
	deleteCustomer: async (id) => {
		set({ loading: true });
		try {
			await agent.Customers.delete(id);
			set((state) => ({ customers: state.customers.filter((c) => c.id !== id) }));
			toast.info('Deleted');
		} catch (error) {
			console.log(error);
		}

		set({ loading: false });
	},
}));

export default useCustomerStore;
