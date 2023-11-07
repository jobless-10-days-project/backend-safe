import { ForbiddenException, Injectable,} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/user.service";
import { CreateUserDto } from "src/users/user.dto";
import { HttpService } from "@nestjs/axios";
import { SignInDto, SignUpDto } from "./auth.dto";


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService

    ) {}

    async signUp(dto: CreateUserDto){
        let user = await this.userService.findOneByStudentId(dto.studentId);

        if(user) throw new ForbiddenException('Credentials taken');

        user = await this.userService.createUser(dto);


        const access_token = this.jwtService.sign({
            sub: user.studentId
        });

        return {
            access_token
        };
    }

    async signIn(dto: CreateUserDto){
        let user = await this.userService.findOneByStudentId(dto.studentId);

        if(!user || dto.password != user.password) throw new ForbiddenException('Credentials incorrect');

        const access_token = this.jwtService.sign({
            sub: user.studentId
        });

        return {
            access_token
        };
    }

/*
    async paotoongSignIn(dto: SignInDto) {

        const response = await this.httpService
            .post('https://paotooong.thinc.in.th/v1/auth/login', {
              email: dto.email,
              password: dto.password,
            })
            .toPromise();
        console.log(response);

        try {
          // Make the POST request to the API endpoint
          const response = await this.httpService
            //.post('https://paotooong.thinc.in.th/v1/auth/login', {
            .get('https://paotooong.thinc.in.th/v1/auth/me', {  
              //email: dto.email,
              //password: dto.password,
            })
            .toPromise(); // Use toPromise() to await the response
            console.log(response);
          // Check if the request was successful
          if (response.status === 200) {
            // Access the response data
            const user = response.data;
    
            // Generate an access token using JwtService
            const accessToken = this.jwtService.sign({
              sub: user.email,
            });
    
            return {
              accessToken,
            };
          } else {
            // Handle the error or return an appropriate response
            console.error('API request failed with status code:', response.status);
            return null;
          }
        } catch (error) {
          // Handle any network errors or exceptions
          console.error('An error occurred:', error.message);
          return null;
        }
    }

    async paotoongSignUp(dto: SignUpDto) {

      const response = await this.httpService
          .post('https://paotooong.thinc.in.th/v1/auth/register', {
            
            email: dto.email,
            password: dto.password,
            firstName: dto.firstName,
            familyName: dto.familyName
          })
          .toPromise();
      console.log(response);
      
      const user = await this.userService.createUser(dto);
    }

      try {
        // Make the POST request to the API endpoint
        const response = await this.httpService
          .post('https://paotooong.thinc.in.th/v1/auth/login', {
            email: dto.email,
            password: dto.password,
          })
          .toPromise(); // Use toPromise() to await the response
          console.log(response);
        // Check if the request was successful
        if (response.status === 200) {
          // Access the response data
          const user = response.data;
  
          // Generate an access token using JwtService
          const accessToken = this.jwtService.sign({
            sub: user.email,
          });
  
          return {
            accessToken,
          };
        } else {
          // Handle the error or return an appropriate response
          console.error('API request failed with status code:', response.status);
          return null;
        }
      } catch (error) {
        // Handle any network errors or exceptions
        console.error('An error occurred:', error.message);
        return null;
      }
    }
*/
}
