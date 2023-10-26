<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">simple-ts</h3>

  <p align="center">
    minimalist typescript boilerplate
    <br />
    <a href="https://github.com/SimpleIdeaLabs/simple-ts"><strong>Explore the docs »</strong></a>
    <br />
  </p>
</div>

<!-- GETTING STARTED -->
## Getting Started

a simple boilerplate for typescript projects, equipped with common necessary tools for software development using typescript such as, code formatting using ***eslint and prettier***, mandatory code standard implementation using ***husky***, testing using ***jest***, and ready setup for development with ***docker***

### Usage

1. Clone repo

    ```
    git clone git@github.com:SimpleIdeaLabs/simple-ts.git
    ```

2. Check node version, current supported node version is ***NodeJs v16.17***

    install via ***nvm*** if not yet available
    ```
    nvm install 16.17
    ```

    set node version to ***16.17***
    ```
    nvm use 16.17
    ```

3. Install node modules

    ```
    npm install
    ```

4. Build source

    ```
    npm run build
    ```

5. Running development

    ```
    npm run dev
    ```

6. Running docker development ***(Optional)***
    <small>Running with docker is optional and is only useful when building backend apis</small>

    ```
    docker-compose up
    ```


7. Running lint

    ```
    npm run lint
    ```

8. Running prettier-format

    ```
    npm run prettier-format
    ```

9. Running test

    ```
    npm run test
    ```

10. Git commit triggers husky
    <small>husky runs in the background the following command:</small>

    ```
    npm run prettier-format && npm run lint && npm run test
    ```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Mark Ernest R. Matute- [linkedin](https://www.linkedin.com/in/mark-matute/) - markernest.matute@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>
