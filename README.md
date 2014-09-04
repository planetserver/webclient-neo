# PlanetServer Neo Client

## Setup

### Requirements
- Nginx Web Server [(Official Page)](http://nginx.org/) . On CentOS 7, it might be handy to install nginx from source.
- Node.JS + Node Package Manager [(Download here)](http://nodejs.org/)
- Other requirements as described in the [(installation guide)](https://github.com/planetserver/webclient-neo/blob/master/InstallationGuide.md).

### Steps
1. Setup server system as described in the document provided on Teamwork
2. Copy Nginx configuration from: [`utils/planetserver.conf`](utils/planetserver.conf) to the respective location (e.g. `/etc/nginx/conf.d/`)
3. Install node modules running the following commands in the main directory: `npm install -g grunt-cli && npm install`
4. Create the directory: `/data/planetserver/static` (*)
5. Run nginx server by running: `nginx`
6. Compiling the resources by running: `grunt build`
7. Copy other dependencies by running: `grunt copy:dep`
8. Collect static files running: `python manage.py collectstatic`
9. Start Django server running: `python manage.py runserver`

(*) The path can be alternated but needs to be changed in the [`planetserver.conf:10`](utils/planetserver.conf#L10) and [`settings.py:67`](planet/settings.py#L67).

## Development
When code changes are done it is currently necessary to re-run the steps `6.`-`8.` of the setup. The scripts will be minified. If you want to have unminified scripts for debugging change in [`settings.py:7`](planet/settings.py#L7) the `DEBUG` value to `True`. 


## Contributors

Neo is based on the Classic client with some extended functionalities. It was initially developed within the EarhtServer project though a contract with *Software Engineering Italia*

Dominik Kundel - [dominik.kundel@gmail.com](mailto:dominik.kundel@gmail.com), 

Valentine Chiwome
