import { Col, Container, Row } from 'react-grid-system';
import useCustomerStore from '../../hooks/customerStore';
import { SyntheticEvent, useEffect, useState } from 'react';
import LoadingFull from '../../features/common/LoadingFull';
import { format } from 'date-fns';
import SimpleButton from '../../features/common/SimpleButton';
import { useModalStore } from '../../hooks/useModalStore';
import CustomerForm from './CustomerForm';

export default function CustomerList() {
	const customerStore = useCustomerStore();
	const modalStore = useModalStore();
	const [loadingTarget, setLoadingTarget] = useState('');

	useEffect(() => {
		if (customerStore.customers.length <= 1) customerStore.loadCustomers();
	}, []);

	const handleDelete = (e: React.SyntheticEvent<HTMLButtonElement>, customerId: string) => {
		setLoadingTarget(e.currentTarget.name);
		customerStore.deleteCustomer(customerId);
	};

	if (customerStore.initialLoading) return <LoadingFull />;

	return (
		<div className='admin__segment'>
			<div className='admin__segment-header'>
				<h3 className='admin__heading'>Customers</h3>
			</div>
			<Container fluid className='grid'>
				<Row wrap='nowrap' className='grid__row grid__header' debug>
					<Col className='grid__col' md={1} debug>
						Name
					</Col>
					<Col className='grid__col' md={3} debug>
						Email
					</Col>
					<Col className='grid__col' md={1} debug>
						Tel
					</Col>
					<Col className='grid__col' md={2} debug>
						Course
					</Col>
					<Col className='grid__col' md={2} debug>
						Description
					</Col>
					<Col className='grid__col' md={2} debug>
						Reg Date
					</Col>
					<Col className='grid__col' md={1} debug>
						Action
					</Col>
				</Row>
				{customerStore.customers.map((customer) => (
					<Row key={customer.id} wrap='nowrap' className='grid__row' debug>
						<Col className='grid__col' md={1} debug>
							{customer.name}
						</Col>
						<Col className='grid__col' md={3} debug>
							{customer.email}
						</Col>
						<Col className='grid__col' md={1} debug>
							{customer.tel}
						</Col>
						<Col className='grid__col' md={2} debug>
							{customer.courseName}
						</Col>
						<Col className='grid__col' md={2} debug>
							{customer.description}
						</Col>
						<Col className='grid__col' md={2} debug>
							{customer.regDate && format(customer.regDate, 'dd MMM yy h:mm aa')}
						</Col>
						<Col className='grid__col' md={1} debug>
							<SimpleButton
								text='EDIT'
								onClick={() =>
									modalStore.openModal(<CustomerForm customer={customer} />, "medium")
								}
							/>
							<SimpleButton
								name={customer.id}
								loading={loadingTarget == customer.id && customerStore.loading}
								text={'DELETE'}
								onClick={(e: SyntheticEvent<HTMLButtonElement>) => {
									handleDelete(e, customer.id);
								}}
							/>
						</Col>
					</Row>
				))}
			</Container>
		</div>
	);
}
