import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import {
	Button,
	Collapse,
	NavbarBrand,
	Navbar,
	Container,
	UncontrolledTooltip
} from "reactstrap";

class BaseNavbar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			collapseOpen: false,
			modalSearch: false,
			color: "navbar-transparent",
		};
	}

	componentDidMount() {
		window.addEventListener("resize", () => this.updateColor());
	}

	componentWillUnmount() {
		window.removeEventListener("resize", () => this.updateColor());
	}

	// function that adds color white/transparent to the navbar on resize (this is for the collapse)
	updateColor() {
		if (window.innerWidth < 993 && this.state.collapseOpen) {
			this.setState({
				color: "bg-white",
			});
		} else {
			this.setState({
				color: "navbar-transparent",
			});
		}
	}

	// this function opens and closes the collapse on small devices
	toggleCollapse() {
		if (this.state.collapseOpen) {
			this.setState({
				color: "navbar-transparent"
			});
		} else {
			this.setState({
				color: "bg-white"
			});
		}
		this.setState({
			collapseOpen: !this.state.collapseOpen
		});
	}

	// this function is to open the Search modal
	toggleModalSearch() {
		this.setState({
			modalSearch: !this.state.modalSearch
		});
	}

	render() {
		return (
			<div>
				<Navbar className={classNames("navbar-absolute", { [this.state.color]: this.props.location.pathname.indexOf("full-screen-map") === -1 })} expand="lg">
					<Container fluid>
						<div className="navbar-wrapper">
							<div className={classNames("navbar-toggle d-inline", { toggled: this.props.sidebarOpened })}>
								<button
									className="navbar-toggler"
									type="button"
									onClick={ this.props.toggleSidebar }>
									<span className="navbar-toggler-bar bar1" />
									<span className="navbar-toggler-bar bar2" />
									<span className="navbar-toggler-bar bar3" />
								</button>
							</div>
							<NavbarBrand href="#">
								{ this.props.brandText }
							</NavbarBrand>
						</div>
						<button
							className="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navigation"
							aria-expanded="false"
							aria-label="Toggle navigation"
							onClick={ () => this.toggleCollapse() }>
							<span className="navbar-toggler-bar navbar-kebab" />
							<span className="navbar-toggler-bar navbar-kebab" />
							<span className="navbar-toggler-bar navbar-kebab" />
						</button>
						<Collapse navbar isOpen={ this.state.collapseOpen }>
							{ this.props.render(this.state) }
						</Collapse>
					</Container>
				</Navbar>
			</div>
		);
	}
}

BaseNavbar.propTypes = {
	brandText: PropTypes.string,
	brandUrl: PropTypes.string,
};

BaseNavbar.defaultProps = {
	brandUrl: "/",
};

export default BaseNavbar;
