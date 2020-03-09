import { storiesOf } from '@storybook/react';
import React from "react";
import {
	Nav,
	NavLink,
	NavItem,
	Container,
} from "reactstrap";
import StoryRouter from 'storybook-react-router'

import { BasePage } from "./BasePage";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";


/**
 * Just a very simple component to use in the routes, isn't rendered anywhere since
 * routing isn't really setup
 */
const MockComponent = () => {
	return (
		<div>
			<h1>Just an empty component for the routes</h1>
		</div>
	);
};

const routes = [
	{
		name: "Home",
		icon: "fas fa-home",
		path: "/home",
		component: MockComponent,
		layout: "",
	},
	{
		name: "About",
		icon: "fas fa-user-secret",
		path: "/about",
		component: MockComponent,
		layout: "",
	},
	{
		name: "Contact",
		icon: "fas fa-edit",
		path: "/contact",
		component: MockComponent,
		layout: "",
	},
];

/**
 * Builds a sample navbar to give you a sense of what you could do on your app
 */
const mockNavbar = () => {
	return (
		<Nav className="ml-auto" navbar>
            <NavItem>
				<NavLink href="#">Account</NavLink>
            </NavItem>
		</Nav>
	);
};

/**
 * Helper function used by these stories to build out the BasePage component and pass
 * in the props
 *
 * NOTE: you don't have to pass in a themeMode prop, it will default to dark, but to get
 * all the stories to work I am explicitly passing in the default
 * @param {*} props 
 */
const createBasePageComponent = (props) => (
	<BasePage
		routes={ routes }
		renderNavbar={ () => mockNavbar() }
		// themeMode="dark"
		{ ...props }
	>
		<h1>Your App's Content Here</h1>
		<hr/>
		<p>You can create a base page for your project using this component</p>
		<h4>Its configuration options include:</h4>
		<ul>
			<li>Configure a custom render function to build your app's navbar</li>
			<li>Configure you sidebar color to be one of "primary", "blue", "green", "orange", "red". The default is "blue"</li>
			<li>Define a default active route or it sets the first one on the list by default</li>
			<li>Configure a custom sidebar icon</li>
			<li>Provide a render function to include an optional footer component</li>
			<li>Use icons from any font icon library</li>
		</ul>
	</BasePage>
);

/**
 * Story displaying the component's default configuration
 */
storiesOf("Base Page", module)
	.addDecorator(StoryRouter())
	.add("Default", () => createBasePageComponent({}));

/**
 * Stories displaying the different sidebar configuration options
 */
storiesOf("Base Page|Sidebar Configuration", module)
	.addDecorator(StoryRouter())
	.add("Always Expanded", () => (
		createBasePageComponent({ sidebarCollapsed: false })
	))
	.add("Custom Icon", () => (
		createBasePageComponent({
			sidebarLogo: {
				innerLink: "#",
				text: "A bluvector App",
				imgSrc: "fas fa-futbol fa-2x",
				logoType: "icon",
			},
		})
	));

/**
 * Additional stories related to the sidebar but only related to the
 * different colors that can be applied
 */
storiesOf("Base Page|Sidebar Colors", module)
	.addDecorator(StoryRouter())
	.add("Primary", () => (
		createBasePageComponent({ activeColor: "primary" })
	))
	.add("Orange", () => (
		createBasePageComponent({ activeColor: "orange" })
	))
	.add("Green", () => (
		createBasePageComponent({ activeColor: "green" })
	))
	.add("Red", () => (
		createBasePageComponent({ activeColor: "red" })
	));

/**
 * Stories displaying the component when configured in light mode
 */
storiesOf("Base Page|Light Mode", module)
	.addDecorator(StoryRouter())
	.add("Default", () => (
		createBasePageComponent({ themeMode: "light" })
	))
	.add("Primary", () => (
		createBasePageComponent({ themeMode: "light", activeColor: "primary" })
	))
	.add("Orange", () => (
		createBasePageComponent({ themeMode: "light", activeColor: "orange" })
	))
	.add("Green", () => (
		createBasePageComponent({ themeMode: "light", activeColor: "green" })
	))
	.add("Red", () => (createBasePageComponent({ themeMode: "light", activeColor: "red" })));

/**
 * Stories displaying the icons coming in from a different icon library
 */
storiesOf("Base Page|Icons", module)
	.addDecorator(StoryRouter())
	// .add("Sidebar icon", () => {
	// 	return createBasePageComponent({});
	// })
	.add("Tim icons", () => {
		const timIconsRoutes = [
			{
				name: "Home",
				icon: "tim-icons icon-app",
				path: "/home",
				component: MockComponent,
				layout: "",
			},
			{
				name: "About",
				icon: "tim-icons icon-molecule-40",
				path: "/about",
				component: MockComponent,
				layout: "",
			},
			{
				name: "Contact",
				icon: "tim-icons icon-coins",
				path: "/contact",
				component: MockComponent,
				layout: "",
			},
		];
		const props = {
			routes: timIconsRoutes,
		};
		return createBasePageComponent(props);
	});

/**
 * Stories displaying the optional configuration option of displaying a custom footer
 */
storiesOf("Base Page|Footer", module)
	.addDecorator(StoryRouter())
	.add("Optional Footer", () => {
		const mockFooter = () => {
			return (
				<footer>
					<Container fluid className="text-right">
						<i className="far fa-copyright" />
						<span className="text-muted">Place sticky <a href="#">footer content</a> here.</span>
					</Container>
				</footer>
			);
		};
		const props = {
			renderFooter: () => mockFooter(),
		};
		return createBasePageComponent(props);
	});
