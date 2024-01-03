function(instance, properties, context) {
  instance.data.input.multiple = properties.multiple;
  instance.data.input.accept = properties.accept ? properties.accept : "*";
  instance.data.websiteHomeUrl = properties.websiteHomeUrl;
}