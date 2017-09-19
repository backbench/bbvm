gem install dpl
dpl --provider="lambda" --access_key_id="$AWS_ACCESS_KEY" --secret_access_key="$AWS_SECRET_KEY" --function_name="bbvm-dev" --role="$AWS_LAMBDA_ROLE" --handler_name="handler" --timeout="10" --memory-size="256" --runtime="nodejs4.3";
