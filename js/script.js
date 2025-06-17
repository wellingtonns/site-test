function gerarDockerfile() {
  const base = document.getElementById('base').value;
  const linguagens = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value)
    .filter(v => ["Node", "Python", "Java", "Go"].includes(v));

  const ferramentas = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value)
    .filter(v => ["Docker CLI", "Kubectl", "Helm", "Terraform"].includes(v));

  let output = `FROM ${base}:latest\n\n`;

  if (base !== "alpine") {
    output += "RUN apt-get update && apt-get install -y \\\n";
    output += "    curl wget git unzip ca-certificates \\\n";
    output += "    && rm -rf /var/lib/apt/lists/*\n\n";
  } else {
    output += "RUN apk add --no-cache curl wget git unzip ca-certificates\n\n";
  }

  linguagens.forEach(lang => {
    if (lang === "Node") {
      output += "# Instalar Node.js\n";
      if (base !== "alpine") {
        output += "RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \\\n";
        output += "    && apt-get install -y nodejs\n\n";
      } else {
        output += "RUN apk add --no-cache nodejs npm\n\n";
      }
    }
    if (lang === "Python") {
      output += "# Instalar Python\n";
      if (base !== "alpine") {
        output += "RUN apt-get install -y python3 python3-pip\n\n";
      } else {
        output += "RUN apk add --no-cache python3 py3-pip\n\n";
      }
    }
    if (lang === "Java") {
      output += "# Instalar Java\n";
      if (base !== "alpine") {
        output += "RUN apt-get install -y openjdk-17-jdk\n\n";
      } else {
        output += "RUN apk add --no-cache openjdk17\n\n";
      }
    }
    if (lang === "Go") {
      output += "# Instalar Go\n";
      output += "RUN wget https://golang.org/dl/go1.22.0.linux-amd64.tar.gz \\\n";
      output += "    && tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz \\\n";
      output += "    && rm go1.22.0.linux-amd64.tar.gz \n";
      output += "ENV PATH=\"/usr/local/go/bin:$PATH\"\n\n";
    }
  });

  ferramentas.forEach(tool => {
    if (tool === "Docker CLI") {
      output += "# Instalar Docker CLI\n";
      if (base !== "alpine") {
        output += "RUN apt-get install -y docker.io\n\n";
      } else {
        output += "RUN apk add --no-cache docker-cli\n\n";
      }
    }
    if (tool === "Kubectl") {
      output += "# Instalar kubectl\n";
      output += "RUN curl -LO \"https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl\" \\\n";
      output += "    && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl \\\n";
      output += "    && rm kubectl\n\n";
    }
    if (tool === "Helm") {
      output += "# Instalar Helm\n";
      output += "RUN curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash\n\n";
    }
    if (tool === "Terraform") {
      output += "# Instalar Terraform\n";
      output += "RUN wget https://releases.hashicorp.com/terraform/1.8.5/terraform_1.8.5_linux_amd64.zip \\\n";
      output += "    && unzip terraform_1.8.5_linux_amd64.zip \\\n";
      output += "    && mv terraform /usr/local/bin/ \\\n";
      output += "    && rm terraform_1.8.5_linux_amd64.zip\n\n";
    }
  });

  output += 'CMD ["bash"]\n';

  document.getElementById('output').value = output;
}
